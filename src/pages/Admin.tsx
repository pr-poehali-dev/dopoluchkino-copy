import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface LoanApplication {
  id: number;
  application_number: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  loan_amount: number;
  loan_term_months: number;
  monthly_payment: number;
  status: string;
  created_at: string;
  processed_at?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateComment, setUpdateComment] = useState('');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    pending: 'Ожидает',
    processing: 'В обработке',
    approved: 'Одобрена',
    rejected: 'Отклонена',
    completed: 'Завершена'
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? 'https://functions.poehali.dev/99d7338a-0c6a-4c37-b108-c6e13d47cd1b'
        : `https://functions.poehali.dev/99d7338a-0c6a-4c37-b108-c6e13d47cd1b?status=${statusFilter}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive"
      });
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId: number, newStatus: string, comment: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/99d7338a-0c6a-4c37-b108-c6e13d47cd1b', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appId,
          status: newStatus,
          comment: comment
        })
      });

      if (response.ok) {
        toast({
          title: "Статус обновлён",
          description: `Заявка переведена в статус "${statusLabels[newStatus as keyof typeof statusLabels]}"`,
        });
        fetchApplications();
        setSelectedApp(null);
        setUpdateComment('');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const searchMatch = 
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    
    return searchMatch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-nunito text-3xl font-bold text-gray-800 mb-2">
                Админ-панель ФинКонсалт
              </h1>
              <p className="text-gray-600">Управление заявками на кредиты</p>
            </div>
            <Button onClick={fetchApplications} variant="outline">
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Обновить
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon name="FileText" size={24} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Всего заявок</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Icon name="Clock" size={24} className="text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ожидают</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icon name="CheckCircle" size={24} className="text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Одобрено</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Icon name="XCircle" size={24} className="text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Отклонено</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по номеру заявки, имени или телефону..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидают</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="approved">Одобрено</SelectItem>
                  <SelectItem value="rejected">Отклонено</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="List" size={20} />
              Заявки на кредиты ({filteredApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Icon name="Loader2" size={32} className="animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Загрузка заявок...</span>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <Icon name="FileX" size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Заявки не найдены</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер заявки</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Платёж</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-sm">
                          {app.application_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.first_name} {app.last_name}</div>
                            <div className="text-sm text-gray-500">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{app.phone}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{app.loan_amount?.toLocaleString()} ₽</div>
                            <div className="text-sm text-gray-500">{app.loan_term_months} мес.</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {app.monthly_payment?.toLocaleString()} ₽
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                            {statusLabels[app.status as keyof typeof statusLabels]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(app.created_at).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedApp(app)}
                              >
                                <Icon name="Edit" size={14} className="mr-1" />
                                Изменить
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Заявка {app.application_number}
                                </DialogTitle>
                              </DialogHeader>
                              
                              {selectedApp && (
                                <div className="space-y-6">
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">Информация о клиенте</h3>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">ФИО:</span> {selectedApp.first_name} {selectedApp.last_name}</p>
                                        <p><span className="font-medium">Телефон:</span> {selectedApp.phone}</p>
                                        <p><span className="font-medium">Email:</span> {selectedApp.email}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-semibold mb-2">Параметры кредита</h3>
                                      <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Сумма:</span> {selectedApp.loan_amount?.toLocaleString()} ₽</p>
                                        <p><span className="font-medium">Срок:</span> {selectedApp.loan_term_months} месяцев</p>
                                        <p><span className="font-medium">Платёж:</span> {selectedApp.monthly_payment?.toLocaleString()} ₽</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-2">Изменить статус</h3>
                                    <div className="space-y-4">
                                      <Textarea
                                        placeholder="Комментарий к изменению статуса (необязательно)"
                                        value={updateComment}
                                        onChange={(e) => setUpdateComment(e.target.value)}
                                        rows={3}
                                      />
                                      
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {Object.entries(statusLabels).map(([status, label]) => (
                                          <Button
                                            key={status}
                                            variant={selectedApp.status === status ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => updateApplicationStatus(selectedApp.id, status, updateComment)}
                                            disabled={selectedApp.status === status}
                                          >
                                            {label}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;