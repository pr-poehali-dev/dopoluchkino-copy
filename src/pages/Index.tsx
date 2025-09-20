import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calculator } from '@/components/Calculator';
import Icon from '@/components/ui/icon';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-mint/5 to-sky/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/50 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-nunito text-2xl font-bold text-gray-800">ФинКонсалт</div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-600 hover:text-coral transition-colors">Главная</a>
              <a href="#services" className="text-gray-600 hover:text-coral transition-colors">Услуги</a>
              <a href="#about" className="text-gray-600 hover:text-coral transition-colors">О нас</a>
              <a href="#faq" className="text-gray-600 hover:text-coral transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-600 hover:text-coral transition-colors">Контакты</a>
              <a href="/admin" className="text-gray-600 hover:text-coral transition-colors">Админ</a>
            </div>
            <Button className="bg-coral hover:bg-coral-dark text-white">
              Консультация
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="font-nunito text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                Финансовые решения для 
                <span className="text-transparent bg-gradient-to-r from-coral to-sky bg-clip-text"> вашего будущего</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Профессиональные консультации, кредитование и инвестиционные решения. 
                Помогаем достичь финансовых целей с 2010 года.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral text-white px-8 py-4"
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  Получить консультацию
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-coral text-coral hover:bg-coral hover:text-white px-8 py-4"
                >
                  <Icon name="Calculator" size={20} className="mr-2" />
                  Рассчитать кредит
                </Button>
              </div>
            </div>
            
            <div className="animate-slide-up">
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-gray-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-nunito text-4xl font-bold text-gray-800 mb-4">Наши услуги</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Полный спектр финансовых услуг для частных лиц и бизнеса
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "CreditCard",
                title: "Кредитование",
                description: "Потребительские кредиты, ипотека, автокредиты с выгодными условиями",
                color: "coral"
              },
              {
                icon: "TrendingUp",
                title: "Инвестиции",
                description: "Индивидуальные инвестиционные портфели и управление капиталом",
                color: "mint"
              },
              {
                icon: "Shield",
                title: "Страхование",
                description: "Защита жизни, здоровья, имущества и бизнеса",
                color: "sky"
              },
              {
                icon: "PiggyBank",
                title: "Накопления",
                description: "Депозиты, накопительные программы и планирование бюджета",
                color: "coral"
              },
              {
                icon: "Building",
                title: "Для бизнеса",
                description: "Корпоративное кредитование и финансовое планирование",
                color: "mint"
              },
              {
                icon: "Users",
                title: "Консультации",
                description: "Персональное финансовое планирование и экспертная поддержка",
                color: "sky"
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-${service.color} to-${service.color}-dark flex items-center justify-center mb-4 group-hover:animate-float`}>
                    <Icon name={service.icon as any} size={28} className="text-white" />
                  </div>
                  <CardTitle className="font-nunito text-xl text-gray-800">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-nunito text-4xl font-bold text-gray-800 mb-6">О компании ФинКонсалт</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Более 13 лет мы помогаем клиентам принимать верные финансовые решения. 
                Наша команда профессионалов обладает глубокими знаниями рынка и опытом 
                работы с ведущими финансовыми институтами.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { number: "5000+", label: "Довольных клиентов" },
                  { number: "13", label: "Лет на рынке" },
                  { number: "50+", label: "Банков-партнеров" },
                  { number: "98%", label: "Одобрений заявок" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4">
                    <div className="font-nunito text-3xl font-bold text-coral mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-coral/20 via-mint/20 to-sky/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Award" size={80} className="text-coral mx-auto mb-4" />
                    <h3 className="font-nunito text-2xl font-bold text-gray-800 mb-2">Лицензии и награды</h3>
                    <p className="text-gray-600">Все необходимые лицензии ЦБ РФ и отраслевые награды</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-gray-50/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-nunito text-4xl font-bold text-gray-800 mb-4">Часто задаваемые вопросы</h2>
            <p className="text-xl text-gray-600">Ответы на популярные вопросы наших клиентов</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "Какие документы нужны для получения кредита?",
                answer: "Для получения кредита потребуется паспорт, справка о доходах (2-НДФЛ или справка по форме банка), трудовая книжка или трудовой договор. В зависимости от суммы кредита могут потребоваться дополнительные документы."
              },
              {
                question: "Сколько времени занимает рассмотрение заявки?",
                answer: "Предварительное решение принимается в течение 15 минут. Окончательное решение и выдача средств - от 1 до 3 рабочих дней в зависимости от типа кредита и полноты предоставленных документов."
              },
              {
                question: "Можно ли погасить кредит досрочно?",
                answer: "Да, все наши кредитные продукты предусматривают возможность досрочного погашения без штрафов и комиссий. Это позволит вам сэкономить на процентах."
              },
              {
                question: "Какая минимальная сумма для инвестиций?",
                answer: "Минимальная сумма для начала инвестирования составляет 50 000 рублей. Мы поможем подобрать оптимальную стратегию в зависимости от ваших целей и горизонта планирования."
              },
              {
                question: "Предоставляете ли вы онлайн-консультации?",
                answer: "Да, мы проводим консультации как очно в офисе, так и онлайн через видеосвязь. Также доступны телефонные консультации и поддержка через мессенджеры."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-lg px-6">
                <AccordionTrigger className="font-nunito font-semibold text-gray-800 hover:text-coral">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-nunito text-4xl font-bold text-gray-800 mb-4">Связаться с нами</h2>
            <p className="text-xl text-gray-600">Готовы ответить на ваши вопросы и помочь с финансовыми решениями</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="font-nunito text-2xl font-bold text-gray-800 mb-8">Контактная информация</h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: "MapPin",
                    title: "Адрес",
                    content: "г. Москва, ул. Финансовая, д. 15, офис 301"
                  },
                  {
                    icon: "Phone",
                    title: "Телефон",
                    content: "+7 (495) 123-45-67"
                  },
                  {
                    icon: "Mail",
                    title: "Email",
                    content: "info@finconsalt.ru"
                  },
                  {
                    icon: "Clock",
                    title: "Режим работы",
                    content: "Пн-Пт: 9:00-19:00, Сб: 10:00-16:00"
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-coral to-coral-dark rounded-lg flex items-center justify-center">
                      <Icon name={contact.icon as any} size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-nunito font-semibold text-gray-800 mb-1">{contact.title}</h4>
                      <p className="text-gray-600">{contact.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="font-nunito text-2xl text-gray-800">Отправить сообщение</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                    <Input placeholder="Ваше имя" className="border-coral/30 focus:border-coral" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                    <Input placeholder="+7 (___) ___-__-__" className="border-coral/30 focus:border-coral" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input placeholder="your@email.com" className="border-coral/30 focus:border-coral" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Сообщение</label>
                  <Textarea 
                    placeholder="Опишите ваш вопрос или запрос..." 
                    rows={4} 
                    className="border-coral/30 focus:border-coral"
                  />
                </div>
                
                <Button className="w-full bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral text-white">
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить сообщение
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-nunito text-2xl font-bold mb-4">ФинКонсалт</div>
              <p className="text-gray-400 leading-relaxed">
                Надёжный партнёр в решении финансовых вопросов с 2010 года.
              </p>
            </div>
            
            <div>
              <h4 className="font-nunito font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Кредитование</li>
                <li>Инвестиции</li>
                <li>Страхование</li>
                <li>Консультации</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-nunito font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li>О нас</li>
                <li>Лицензии</li>
                <li>Новости</li>
                <li>Карьера</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-nunito font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <p>+7 (495) 123-45-67</p>
                <p>info@finconsalt.ru</p>
                <p>г. Москва, ул. Финансовая, 15</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ФинКонсалт. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;