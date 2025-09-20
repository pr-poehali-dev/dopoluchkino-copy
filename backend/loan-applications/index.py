import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from decimal import Decimal


@dataclass
class LoanApplication:
    first_name: str
    last_name: str
    phone: str
    email: str
    loan_amount: float
    loan_term_months: int
    interest_rate: float = 12.0
    loan_purpose: Optional[str] = None
    monthly_income: Optional[float] = None
    employment_type: Optional[str] = None
    monthly_payment: Optional[float] = None
    total_payment: Optional[float] = None
    overpayment: Optional[float] = None


def get_db_connection():
    """Получение подключения к базе данных"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL environment variable not found')
    return psycopg2.connect(database_url)


def calculate_loan_payments(amount: float, term_months: int, rate: float) -> Dict[str, float]:
    """Расчёт платежей по кредиту"""
    monthly_rate = rate / 100 / 12
    
    if monthly_rate == 0:
        monthly_payment = amount / term_months
    else:
        monthly_payment = (amount * monthly_rate * (1 + monthly_rate) ** term_months) / \
                         ((1 + monthly_rate) ** term_months - 1)
    
    total_payment = monthly_payment * term_months
    overpayment = total_payment - amount
    
    return {
        'monthly_payment': round(monthly_payment, 2),
        'total_payment': round(total_payment, 2),
        'overpayment': round(overpayment, 2)
    }


def generate_application_number(conn) -> str:
    """Генерация уникального номера заявки"""
    cursor = conn.cursor()
    year = datetime.now().year
    
    cursor.execute("""
        SELECT COUNT(*) FROM loan_applications 
        WHERE application_number LIKE %s
    """, (f'APP-{year}-%',))
    
    count = cursor.fetchone()[0]
    number = f'APP-{year}-{str(count + 1).zfill(6)}'
    cursor.close()
    return number


def create_loan_application(data: Dict[str, Any]) -> Dict[str, Any]:
    """Создание новой заявки на кредит"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Расчёт платежей
        payments = calculate_loan_payments(
            data['loan_amount'], 
            data['loan_term_months'], 
            data.get('interest_rate', 12.0)
        )
        
        # Генерация номера заявки
        app_number = generate_application_number(conn)
        
        # SQL для вставки
        insert_sql = """
            INSERT INTO loan_applications (
                application_number, first_name, last_name, phone, email,
                loan_amount, loan_term_months, interest_rate, loan_purpose,
                monthly_income, employment_type, monthly_payment, 
                total_payment, overpayment, created_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING id
        """
        
        cursor.execute(insert_sql, (
            app_number,
            data['first_name'],
            data['last_name'], 
            data['phone'],
            data['email'],
            data['loan_amount'],
            data['loan_term_months'],
            data.get('interest_rate', 12.0),
            data.get('loan_purpose'),
            data.get('monthly_income'),
            data.get('employment_type'),
            payments['monthly_payment'],
            payments['total_payment'],
            payments['overpayment'],
            datetime.now()
        ))
        
        application_id = cursor.fetchone()[0]
        conn.commit()
        
        return {
            'success': True,
            'application_id': application_id,
            'application_number': app_number,
            'payments': payments
        }
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def get_all_applications(status: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    """Получение всех заявок с фильтрацией"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if status:
            cursor.execute("""
                SELECT id, application_number, first_name, last_name, phone, email,
                       loan_amount, loan_term_months, monthly_payment, status, 
                       created_at, processed_at
                FROM loan_applications 
                WHERE status = %s 
                ORDER BY created_at DESC 
                LIMIT %s
            """, (status, limit))
        else:
            cursor.execute("""
                SELECT id, application_number, first_name, last_name, phone, email,
                       loan_amount, loan_term_months, monthly_payment, status, 
                       created_at, processed_at
                FROM loan_applications 
                ORDER BY created_at DESC 
                LIMIT %s
            """, (limit,))
        
        columns = [desc[0] for desc in cursor.description]
        results = []
        
        for row in cursor.fetchall():
            app_dict = dict(zip(columns, row))
            # Конвертация datetime в строку для JSON
            if app_dict['created_at']:
                app_dict['created_at'] = app_dict['created_at'].isoformat()
            if app_dict['processed_at']:
                app_dict['processed_at'] = app_dict['processed_at'].isoformat()
            results.append(app_dict)
        
        return results
        
    finally:
        cursor.close()
        conn.close()


def update_application_status(app_id: int, new_status: str, comment: Optional[str] = None) -> bool:
    """Обновление статуса заявки"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            UPDATE loan_applications 
            SET status = %s, manager_comment = %s, processed_at = %s, updated_at = %s
            WHERE id = %s
        """, (new_status, comment, datetime.now(), datetime.now(), app_id))
        
        conn.commit()
        return cursor.rowcount > 0
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Business: API для управления заявками на кредиты
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Обработка CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        # Health check
        params = event.get('queryStringParameters') or {}
        if params.get('test') == 'health':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'status': 'healthy', 'service': 'loan-applications'})
            }
        
        if method == 'POST':
            # Создание новой заявки
            body = json.loads(event.get('body', '{}'))
            result = create_loan_application(body)
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result)
            }
        
        elif method == 'GET':
            # Получение списка заявок
            params = event.get('queryStringParameters') or {}
            status = params.get('status')
            limit = int(params.get('limit', 50))
            
            applications = get_all_applications(status, limit)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'applications': applications,
                    'count': len(applications)
                })
            }
        
        elif method == 'PUT':
            # Обновление статуса заявки
            body = json.loads(event.get('body', '{}'))
            app_id = body.get('id')
            new_status = body.get('status')
            comment = body.get('comment')
            
            if not app_id or not new_status:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id or status'})
                }
            
            success = update_application_status(app_id, new_status, comment)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': success})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }