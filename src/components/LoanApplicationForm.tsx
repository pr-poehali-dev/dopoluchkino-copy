import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface LoanCalculation {
  monthly: number;
  total: number;
  overpayment: number;
}

interface LoanApplicationFormProps {
  calculation: LoanCalculation | null;
  loanAmount: string;
  loanTerm: string;
  interestRate: string;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  calculation,
  loanAmount,
  loanTerm,
  interestRate
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    monthlyIncome: '',
    employmentType: '',
    loanPurpose: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calculation) {
      toast({
        title: "Ошибка",
        description: "Сначала рассчитайте параметры кредита",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        loan_amount: parseFloat(loanAmount),
        loan_term_months: parseInt(loanTerm),
        interest_rate: parseFloat(interestRate),
        loan_purpose: formData.loanPurpose,
        monthly_income: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
        employment_type: formData.employmentType || null,
        monthly_payment: calculation.monthly,
        total_payment: calculation.total,
        overpayment: calculation.overpayment
      };

      const response = await fetch('https://functions.poehali.dev/99d7338a-0c6a-4c37-b108-c6e13d47cd1b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Заявка отправлена!",
          description: `Номер заявки: ${result.application_number}. Мы свяжемся с вами в ближайшее время.`,
        });

        // Очистка формы
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          monthlyIncome: '',
          employmentType: '',
          loanPurpose: ''
        });
      } else {
        throw new Error('Ошибка при отправке заявки');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже или свяжитесь с нами по телефону.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!calculation) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-sm border border-white/20">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Icon name="Calculator" size={48} className="mx-auto mb-4 text-gray-400" />
            <p>Сначала рассчитайте параметры кредита</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="font-nunito text-xl text-gray-800 flex items-center justify-center gap-2">
          <Icon name="FileText" size={20} className="text-coral" />
          Подать заявку на кредит
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Краткая информация о расчёте */}
        <div className="mb-6 p-4 bg-gradient-to-r from-mint/10 to-sky/10 rounded-lg border border-mint/20">
          <h3 className="font-nunito font-semibold text-gray-800 mb-2">Ваш расчёт:</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Сумма:</span>
              <span className="font-semibold">{parseFloat(loanAmount).toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span>Срок:</span>
              <span className="font-semibold">{loanTerm} мес.</span>
            </div>
            <div className="flex justify-between">
              <span>Ежемесячный платёж:</span>
              <span className="font-semibold text-coral">{calculation.monthly.toLocaleString()} ₽</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                Имя *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Иван"
                required
                className="border-coral/30 focus:border-coral"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Фамилия *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Петров"
                required
                className="border-coral/30 focus:border-coral"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Телефон *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+7 (___) ___-__-__"
              required
              className="border-coral/30 focus:border-coral"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="ivan@example.com"
              className="border-coral/30 focus:border-coral"
            />
          </div>

          <div>
            <Label htmlFor="monthlyIncome" className="text-sm font-medium text-gray-700">
              Ежемесячный доход (₽)
            </Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              placeholder="80 000"
              className="border-coral/30 focus:border-coral"
            />
          </div>

          <div>
            <Label htmlFor="employmentType" className="text-sm font-medium text-gray-700">
              Тип занятости
            </Label>
            <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
              <SelectTrigger className="border-coral/30 focus:border-coral">
                <SelectValue placeholder="Выберите тип занятости" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Работаю по найму</SelectItem>
                <SelectItem value="self_employed">Индивидуальный предприниматель</SelectItem>
                <SelectItem value="pensioner">Пенсионер</SelectItem>
                <SelectItem value="student">Студент</SelectItem>
                <SelectItem value="unemployed">Временно не работаю</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="loanPurpose" className="text-sm font-medium text-gray-700">
              Цель кредита
            </Label>
            <Textarea
              id="loanPurpose"
              value={formData.loanPurpose}
              onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
              placeholder="Например: покупка автомобиля, ремонт квартиры..."
              rows={3}
              className="border-coral/30 focus:border-coral"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.phone}
            className="w-full bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral text-white font-medium py-3"
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Отправляем заявку...
              </>
            ) : (
              <>
                <Icon name="Send" size={16} className="mr-2" />
                Подать заявку
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
          </p>
        </form>
      </CardContent>
    </Card>
  );
};