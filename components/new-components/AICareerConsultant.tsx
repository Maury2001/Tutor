
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AssessmentData } from '@/pages/Index';
import { Bot, MessageSquare, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AICareerConsultantProps {
  assessmentData: AssessmentData;
  onBack: () => void;
}

const AICareerConsultant = ({ assessmentData, onBack }: AICareerConsultantProps) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', message: string}>>([
    {
      role: 'ai',
      message: `Hello ${assessmentData.name}! I'm your AI Career Consultant. Based on your CBC portfolio assessment showing primary interest in ${assessmentData.topCodes.split(',')[0]} and secondary interest in ${assessmentData.topCodes.split(',')[1]}, I'm here to provide personalized career guidance. What would you like to know about your career options?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate AI response based on assessment data
      const contextualResponse = generateContextualResponse(userMessage, assessmentData);
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'ai', message: contextualResponse }]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
      setIsLoading(false);
    }
  };

  const generateContextualResponse = (question: string, data: AssessmentData): string => {
    const [primary, secondary] = data.topCodes.split(',');
    const questionLower = question.toLowerCase();

    if (questionLower.includes('career') || questionLower.includes('job')) {
      return `Based on your ${primary} primary interest and ${secondary} secondary interest, I recommend exploring careers that combine both areas. For ${primary} interests, consider roles in practical problem-solving, while ${secondary} interests suggest opportunities in collaborative or analytical work. Would you like specific career recommendations for your grade level?`;
    }

    if (questionLower.includes('study') || questionLower.includes('subject')) {
      return `For your CBC portfolio profile (${primary}${secondary}), I recommend focusing on subjects that develop both your primary and secondary interests. Consider taking courses that blend hands-on learning with your secondary interest area. What grade are you currently in so I can provide more specific subject recommendations?`;
    }

    if (questionLower.includes('university') || questionLower.includes('college')) {
      return `With your ${primary}${secondary} profile, you have excellent options for tertiary education. Look for programs that offer practical components alongside theoretical learning. Many universities now offer interdisciplinary programs that would suit your diverse interests. Would you like me to suggest specific fields of study?`;
    }

    return `That's a great question! Based on your CBC portfolio assessment results showing strength in ${primary} and ${secondary} areas, I can provide personalized guidance. Your assessment scores show you're well-suited for careers that combine practical skills with your secondary interests. Could you be more specific about what aspect of your career planning you'd like help with?`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Career Consultant
            </h1>
            <p className="text-gray-600 mt-2">Personalized Career Guidance Based on Your CBC Portfolio</p>
          </div>
          
          <div className="w-24"></div>
        </div>

        <Card className="shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              Career Consultation Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl p-3 rounded-lg ${
                    chat.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border shadow-sm'
                  }`}>
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-600">AI is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me about your career options, study paths, or any questions about your results..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !question.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Quick Career Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Your Primary Strength ({assessmentData.topCodes.split(',')[0]})</h4>
                <p className="text-blue-700 text-sm">
                  This represents your strongest career interest area based on your CBC portfolio assessment.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Your Secondary Strength ({assessmentData.topCodes.split(',')[1]})</h4>
                <p className="text-purple-700 text-sm">
                  This complements your primary interest and opens up interdisciplinary career paths.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICareerConsultant;
