import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send loan applications to AmoCRM as leads with contact information
    Args: event - dict with httpMethod, body containing application data
          context - object with request_id attribute
    Returns: HTTP response with AmoCRM lead creation result
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    amocrm_domain = os.environ.get('AMOCRM_DOMAIN')
    access_token = os.environ.get('AMOCRM_ACCESS_TOKEN')
    
    if not amocrm_domain or not access_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'AmoCRM credentials not configured',
                'message': 'Please add AMOCRM_DOMAIN and AMOCRM_ACCESS_TOKEN secrets'
            })
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    full_name = body_data.get('fullName', '')
    phone = body_data.get('phone', '')
    email = body_data.get('email', '')
    loan_amount = body_data.get('loanAmount', 0)
    loan_term = body_data.get('loanTerm', 0)
    monthly_payment = body_data.get('monthlyPayment', 0)
    total_payment = body_data.get('totalPayment', 0)
    income = body_data.get('income', 0)
    
    contact_data = [{
        'name': full_name,
        'custom_fields_values': [
            {
                'field_code': 'PHONE',
                'values': [{'value': phone, 'enum_code': 'WORK'}]
            },
            {
                'field_code': 'EMAIL',
                'values': [{'value': email, 'enum_code': 'WORK'}]
            }
        ]
    }]
    
    lead_data = [{
        'name': f'Заявка на кредит {loan_amount} руб. - {full_name}',
        'price': int(loan_amount),
        'custom_fields_values': [
            {
                'field_name': 'Сумма кредита',
                'values': [{'value': f'{loan_amount} руб.'}]
            },
            {
                'field_name': 'Срок кредита',
                'values': [{'value': f'{loan_term} мес.'}]
            },
            {
                'field_name': 'Ежемесячный платеж',
                'values': [{'value': f'{monthly_payment} руб.'}]
            },
            {
                'field_name': 'Общая выплата',
                'values': [{'value': f'{total_payment} руб.'}]
            },
            {
                'field_name': 'Доход',
                'values': [{'value': f'{income} руб.'}]
            }
        ]
    }]
    
    try:
        contact_url = f'https://{amocrm_domain}/api/v4/contacts'
        contact_request = urllib.request.Request(
            contact_url,
            data=json.dumps(contact_data).encode('utf-8'),
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(contact_request) as response:
            contact_result = json.loads(response.read().decode('utf-8'))
            contact_id = contact_result['_embedded']['contacts'][0]['id']
        
        lead_data[0]['_embedded'] = {'contacts': [{'id': contact_id}]}
        
        lead_url = f'https://{amocrm_domain}/api/v4/leads'
        lead_request = urllib.request.Request(
            lead_url,
            data=json.dumps(lead_data).encode('utf-8'),
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(lead_request) as response:
            lead_result = json.loads(response.read().decode('utf-8'))
            lead_id = lead_result['_embedded']['leads'][0]['id']
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'lead_id': lead_id,
                'contact_id': contact_id,
                'message': 'Lead successfully created in AmoCRM'
            })
        }
        
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'AmoCRM API error',
                'details': error_body,
                'status_code': e.code
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }
