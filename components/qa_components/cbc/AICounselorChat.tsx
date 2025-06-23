'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, Bot, User, Sparkles, Brain, Target, BookOpen, Award, TrendingUp, Users, Lightbulb, Search, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  topics?: string[];
  sources?: string[];
  relatedQuestions?: string[];
  confidence?: number;
}

interface AICounselorChatProps {
  onNext: () => void;
  data: any;
}

export const AICounselorChat: React.FC<AICounselorChatProps> = ({
  onNext,
  data
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced initial context with comprehensive career information
  const initialContext = {
    learnerProfile: data.learnerProfile,
    topPathway: data.topPathways[0],
    overallScore: data.overallPercentage,
    strengthAreas: Object.entries(data.integratedScores.cbcScores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([area]) => area),
    careerPersonality: Object.entries(data.integratedScores.riasecScores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 2)
      .map(([type]) => type),
    developmentAreas: Object.entries(data.integratedScores.cbcScores)
      .sort(([,a], [,b]) => (a as number) - (b as number))
      .slice(0, 2)
      .map(([area]) => area)
  };

  // Enhanced career guidance prompts with clear categories
  const quickPrompts = [
    {
      text: "What specific careers match my pathway and interests?",
      icon: <Briefcase className="w-4 h-4" />,
      category: "Career Exploration",
      description: "Get detailed career options with salary ranges and job descriptions"
    },
    {
      text: "Which universities and programs should I target?",
      icon: <GraduationCap className="w-4 h-4" />,
      category: "Education Planning",
      description: "University recommendations with admission requirements"
    },
    {
      text: "How can I improve my weak subjects effectively?",
      icon: <TrendingUp className="w-4 h-4" />,
      category: "Academic Improvement",
      description: "Personalized study strategies and improvement plans"
    },
    {
      text: "What skills should I develop for my chosen career?",
      icon: <Target className="w-4 h-4" />,
      category: "Skill Development",
      description: "Essential skills and competencies for career success"
    },
    {
      text: "What are the job market trends in my field?",
      icon: <Lightbulb className="w-4 h-4" />,
      category: "Market Intelligence",
      description: "Current and future job market insights"
    },
    {
      text: "How do I prepare for KCSE to achieve my goals?",
      icon: <Award className="w-4 h-4" />,
      category: "Exam Strategy",
      description: "KCSE preparation strategies and grade targets"
    }
  ];

  useEffect(() => {
    // Enhanced welcome message with clear structure
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: `# Welcome to Your AI Career Mentor! 🎓

Hello **${data.learnerProfile.learnerName}**! I'm your dedicated AI Career Counselor and Educational Mentor. I'm here to provide comprehensive, research-based guidance for your educational journey and career planning.

## 📊 Your Assessment Summary
- **Overall Performance:** ${data.overallPercentage}% 
- **Recommended Pathway:** ${data.topPathways[0]?.name} (${data.topPathways[0]?.match}% match)
- **Your Strengths:** ${initialContext.strengthAreas.slice(0, 2).join(', ')}
- **Career Personality:** ${initialContext.careerPersonality.join(', ')} types
- **Areas for Growth:** ${initialContext.developmentAreas.join(', ')}

## 🎯 How I Can Help You

### 💼 **Career Guidance**
- Detailed career exploration with salary expectations
- Industry insights and growth prospects
- Professional development pathways

### 🎓 **Educational Planning**
- University selection and admission strategies
- Course recommendations and prerequisites
- Scholarship and funding opportunities

### 📚 **Academic Mentoring**
- Subject-specific improvement strategies
- Study techniques and time management
- KCSE preparation and grade optimization

### 🚀 **Personal Development**
- Core competency enhancement
- Leadership and soft skills development
- Extracurricular activity recommendations

## 💡 Ask Me Anything About:
- Specific career roles and requirements
- University programs and applications
- Study strategies and academic improvement
- Future job market trends
- Personal development planning

I'm equipped with comprehensive knowledge of the Kenyan education system, global career trends, and evidence-based learning strategies. Feel free to ask detailed questions - I'll provide thorough, educational responses tailored to your needs!

What would you like to explore first? 🚀`,
      timestamp: new Date(),
      topics: ['introduction', 'career-guidance', 'educational-planning'],
      confidence: 0.95,
      relatedQuestions: [
        "What are the specific job roles available in my recommended pathway?",
        "Which subjects should I focus on improving for my career goals?",
        "What are the admission requirements for top universities in my field?"
      ]
    };

    setMessages([welcomeMessage]);
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('Sending enhanced message to AI career counselor:', messageText);

      const { data: response, error } = await supabase.functions.invoke('ai-counselor-chat', {
        body: {
          message: messageText,
          assessmentData: {
            learnerProfile: data.learnerProfile,
            topPathways: data.topPathways,
            overallPercentage: data.overallPercentage,
            integratedScores: data.integratedScores,
            strengthAreas: initialContext.strengthAreas,
            careerPersonality: initialContext.careerPersonality,
            developmentAreas: initialContext.developmentAreas
          },
          conversationHistory: messages.slice(-5),
          sessionContext: {
            questionsAsked: messages.filter(m => m.type === 'user').length,
            topicsDiscussed: messages.flatMap(m => m.topics || []).filter((topic, index, arr) => arr.indexOf(topic) === index)
          },
          cbcPathwaysData: data.cbcPathways || []
        }
      });

      if (error) {
        console.error('AI counselor error:', error);
        throw error;
      }

      console.log('Enhanced AI counselor response:', response);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.consultation || response.message || 'I apologize, but I encountered an issue. Let me provide you with some general guidance based on your pathway.',
        timestamp: new Date(),
        topics: response.topics || [],
        sources: response.sources || [],
        relatedQuestions: response.relatedQuestions || [],
        confidence: response.confidence || 0.8
      };

      // Simulate thoughtful response time
      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Enhanced educational fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'm experiencing a temporary connection issue, but I can still provide valuable guidance! 

## Based on your question: "${messageText}"

### 🎯 **Your Pathway Analysis**
Your **${data.topPathways[0]?.name}** pathway offers excellent opportunities. Here's what I can share:

**Key Career Options:**
- Primary careers align with your ${initialContext.careerPersonality.join(' and ')} personality
- Strong demand in technology, healthcare, and business sectors
- Salary ranges typically KSh 80,000 - 350,000+ depending on experience

**Academic Focus:**
- Strengthen performance in: ${initialContext.developmentAreas.join(' and ')}
- Maintain excellence in: ${initialContext.strengthAreas[0]}
- Target KCSE grades: B+ overall for top universities

**Next Steps:**
1. Research specific career roles in your field
2. Identify target universities and their requirements
3. Create a focused study plan for weak subjects
4. Explore internship and mentorship opportunities

### 💡 **Quick Tip**
Your ${data.overallPercentage}% performance shows strong potential. Focus on consistent improvement and strategic planning.

Please try your question again for more detailed, personalized guidance! What specific aspect would you like me to elaborate on?`,
        timestamp: new Date(),
        topics: ['fallback', 'career-guidance', 'academic-planning'],
        confidence: 0.7
      };

      setTimeout(() => {
        setMessages(prev => [...prev, fallbackMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);

      toast.error('Temporary connection issue. I\'ve provided some guidance, but please try again for more detailed responses.');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(currentMessage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-2 border-gradient-to-r from-purple-200 to-blue-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold">AI Career Counselor & Educational Mentor</CardTitle>
              <CardDescription className="text-purple-100 text-lg">
                Advanced AI-powered career guidance with deep reasoning and comprehensive educational support
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Enhanced Reasoning
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Educational Expert
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'ai' && (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-4xl p-5 rounded-xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-100 shadow-md'
                  }`}>
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, index) => {
                        // Enhanced markdown parsing for better readability
                        if (line.startsWith('# ')) {
                          return <h1 key={index} className="text-2xl font-bold mb-3 text-gray-800">{line.slice(2)}</h1>;
                        }
                        if (line.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-semibold mb-2 text-gray-700 mt-4">{line.slice(3)}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-medium mb-2 text-gray-600 mt-3">{line.slice(4)}</h3>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={index} className="font-bold mb-2 text-gray-800">{line.slice(2, -2)}</p>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={index} className="mb-1 ml-4">{line.slice(2)}</li>;
                        }
                        if (line.match(/^[🎯📊🎓💼📚🚀💡]/)) {
                          return <p key={index} className="mb-2 font-medium">{line}</p>;
                        }
                        return line && <p key={index} className="mb-2">{line}</p>;
                      })}
                    </div>
                    
                    {/* Enhanced message metadata */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        {message.topics && message.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {message.topics.slice(0, 3).map((topic) => (
                              <Badge key={topic} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {message.confidence && (
                          <Badge variant="secondary" className="text-xs">
                            Confidence: {Math.round(message.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">💡 Related questions you might find helpful:</p>
                        <div className="space-y-1">
                          {message.relatedQuestions.map((question, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickPrompt(question)}
                              className="block text-left text-sm text-blue-600 hover:text-blue-800 hover:underline p-1 rounded hover:bg-blue-50"
                            >
                              • {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border-2 border-gray-100 p-4 rounded-xl shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">AI is analyzing and researching your question...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <Separator />
          
          {/* Enhanced Quick Prompts Section */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Quick Start Questions - Choose a Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickPrompt(prompt.text)}
                  disabled={isLoading}
                  className="text-left justify-start h-auto p-4 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      {prompt.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm mb-1">{prompt.category}</div>
                      <div className="text-xs text-gray-600 mb-1">{prompt.text}</div>
                      <div className="text-xs text-gray-500">{prompt.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Enhanced Message Input */}
          <div className="p-6 bg-white">
            <div className="flex gap-3">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career path, education planning, study strategies, or personal development..."
                disabled={isLoading}
                className="flex-1 h-12 text-base"
              />
              <Button 
                onClick={() => sendMessage(currentMessage)}
                disabled={isLoading || !currentMessage.trim()}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                💡 <strong>Pro Tip:</strong> Ask specific, detailed questions for comprehensive, research-based responses. 
                I'm here to provide thorough educational guidance and career mentoring!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={onNext} variant="outline" size="lg">
          Continue to Report Generation
        </Button>
      </div>
    </div>
  );
};
