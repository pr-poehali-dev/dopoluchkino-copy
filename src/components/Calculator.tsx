import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export const Calculator = () => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [rate, setRate] = useState('12');
  const [result, setResult] = useState<{ monthly: number; total: number; overpayment: number } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const months = parseInt(term);
    const monthlyRate = parseFloat(rate) / 100 / 12;

    if (principal && months && monthlyRate) {
      const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                            (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = monthlyPayment * months;
      const overpayment = totalPayment - principal;

      setResult({
        monthly: Math.round(monthlyPayment),
        total: Math.round(totalPayment),
        overpayment: Math.round(overpayment)
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="font-nunito text-2xl text-gray-800 flex items-center justify-center gap-2">
          <Icon name="Calculator" size={24} className="text-coral" />
          Кредитный калькулятор
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Сумма кредита (₽)
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="500 000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-coral/30 focus:border-coral"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="term" className="text-sm font-medium text-gray-700">
            Срок кредита (месяцы)
          </Label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger className="border-coral/30 focus:border-coral">
              <SelectValue placeholder="Выберите срок" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 месяцев</SelectItem>
              <SelectItem value="24">24 месяца</SelectItem>
              <SelectItem value="36">36 месяцев</SelectItem>
              <SelectItem value="60">60 месяцев</SelectItem>
              <SelectItem value="120">120 месяцев</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate" className="text-sm font-medium text-gray-700">
            Процентная ставка (%)
          </Label>
          <Input
            id="rate"
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border-coral/30 focus:border-coral"
          />
        </div>

        <Button
          onClick={calculateLoan}
          className="w-full bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral text-white font-medium py-3"
          disabled={!amount || !term || !rate}
        >
          <Icon name="Calculator" size={16} className="mr-2" />
          Рассчитать
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-gradient-to-r from-mint/10 to-sky/10 rounded-lg border border-mint/20">
            <h3 className="font-nunito font-semibold text-gray-800 mb-3">Результат расчёта:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ежемесячный платёж:</span>
                <span className="font-semibold text-coral">{result.monthly.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Общая сумма:</span>
                <span className="font-semibold text-sky">{result.total.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Переплата:</span>
                <span className="font-semibold text-gray-800">{result.overpayment.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};