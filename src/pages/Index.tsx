import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Привет! Я AI-ассистент для анализа дипфейков. Загрузите аудиофайл, и я проанализирую его на подлинность.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Симуляция анализа
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, 
        { role: 'user', content: inputMessage },
        { role: 'bot', content: 'Анализирую ваш запрос... Результаты анализа показывают высокую вероятность подлинности аудио.' }
      ]);
      setInputMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Deepfake Detector</h1>
              <p className="text-sm text-gray-500">Анализ аудио на подлинность</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Icon name="Upload" size={16} />
              Загрузка файлов
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Icon name="MessageSquare" size={16} />
              Чат с ботом
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <Icon name="FileDown" size={16} />
              Отчеты
            </TabsTrigger>
          </TabsList>

          {/* Загрузка файлов */}
          <TabsContent value="upload" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Загрузите аудиофайл для анализа</h2>
              <p className="text-gray-600">Поддерживаются форматы: MP3, WAV, M4A, FLAC</p>
            </div>

            <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors">
              <CardContent className="p-12">
                <div className="text-center">
                  <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Перетащите файл сюда или нажмите для выбора</p>
                    <p className="text-sm text-gray-500">Максимальный размер: 50 МБ</p>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button className="mt-4" asChild>
                      <span className="cursor-pointer">Выбрать файл</span>
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {uploadedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Music" size={20} />
                    Анализ файла
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{uploadedFile.name}</span>
                    <Badge variant={analysisProgress === 100 ? "default" : "secondary"}>
                      {analysisProgress === 100 ? "Завершен" : "Анализ..."}
                    </Badge>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                  
                  {analysisProgress === 100 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="CheckCircle" size={20} className="text-green-600" />
                        <span className="font-semibold text-green-800">Анализ завершен</span>
                      </div>
                      <p className="text-green-700">Вероятность подлинности: 94%</p>
                      <p className="text-sm text-green-600 mt-1">Признаков дипфейка не обнаружено</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Чат с ботом */}
          <TabsContent value="chat" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Чат с AI-ассистентом</h2>
              <p className="text-gray-600">Задайте вопросы о результатах анализа</p>
            </div>

            <Card className="h-96">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Задайте вопрос..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Отчеты */}
          <TabsContent value="report" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Отчеты анализа</h2>
              <p className="text-gray-600">Скачайте подробные результаты анализа</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileText" size={20} />
                    Краткий отчет
                  </CardTitle>
                  <CardDescription>
                    Основные результаты анализа в формате PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Статус анализа:</span>
                      <Badge variant="default">Завершен</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Достоверность:</span>
                      <span className="font-semibold text-green-600">94%</span>
                    </div>
                    <Button className="w-full mt-4">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart" size={20} />
                    Детальный анализ
                  </CardTitle>
                  <CardDescription>
                    Подробная техническая информация в формате JSON
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Алгоритмов:</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Метрик:</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Визуализация результатов */}
            <Card>
              <CardHeader>
                <CardTitle>Визуализация результатов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Спектральный анализ</span>
                      <span className="text-sm text-green-600">✓ Пройден</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Анализ паттернов</span>
                      <span className="text-sm text-green-600">✓ Пройден</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Нейронный анализ</span>
                      <span className="text-sm text-green-600">✓ Пройден</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;