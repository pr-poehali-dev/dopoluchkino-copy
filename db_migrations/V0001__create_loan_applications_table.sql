-- Создание последовательности для номеров заявок
CREATE SEQUENCE loan_app_seq START 1;

-- Создание таблицы заявок на кредиты
CREATE TABLE loan_applications (
    id SERIAL PRIMARY KEY,
    
    -- Основная информация о заявке
    application_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    
    -- Персональные данные клиента
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    birth_date DATE,
    passport_series VARCHAR(10),
    passport_number VARCHAR(20),
    
    -- Адресная информация
    address_registration TEXT,
    address_residence TEXT,
    
    -- Информация о кредите
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_term_months INTEGER NOT NULL,
    interest_rate DECIMAL(5,2) DEFAULT 12.0,
    loan_purpose VARCHAR(200),
    loan_type VARCHAR(50) DEFAULT 'consumer',
    
    -- Расчетные поля
    monthly_payment DECIMAL(12,2),
    total_payment DECIMAL(15,2),
    overpayment DECIMAL(15,2),
    
    -- Информация о доходах и занятости
    employment_type VARCHAR(50),
    employer_name VARCHAR(200),
    work_experience_months INTEGER,
    monthly_income DECIMAL(12,2),
    additional_income DECIMAL(12,2) DEFAULT 0,
    
    -- Семейное положение и иждивенцы
    marital_status VARCHAR(20),
    dependents_count INTEGER DEFAULT 0,
    
    -- Существующие обязательства
    existing_loans_payment DECIMAL(12,2) DEFAULT 0,
    credit_history_rating VARCHAR(20),
    
    -- Дополнительная информация
    notes TEXT,
    manager_comment TEXT,
    rejection_reason TEXT,
    
    -- Системные поля
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by VARCHAR(100)
);

-- Создание индексов для быстрого поиска
CREATE INDEX idx_loan_applications_phone ON loan_applications(phone);
CREATE INDEX idx_loan_applications_email ON loan_applications(email);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_created_at ON loan_applications(created_at);
CREATE INDEX idx_loan_applications_app_number ON loan_applications(application_number);