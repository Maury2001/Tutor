
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserData, AssessmentData } from '@/pages/Index';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AssessmentQuestionsProps {
  userData: UserData;
  onComplete: (data: AssessmentData) => void;
}

const questions = [
  // Realistic (R) - 5 questions
  "I enjoy building models, fixing gadgets, or working with tools in Science & Technology class",
  "I would rather do hands-on farming activities than read about agriculture in books",
  "I like working on practical projects like constructing simple machines or electrical circuits",
  "I prefer outdoor physical activities and sports over indoor classroom discussions",
  "I enjoy using technology tools and equipment to solve real-world problems",
  
  // Investigative (I) - 5 questions  
  "I like conducting experiments and investigating scientific questions in the laboratory",
  "I enjoy researching environmental issues affecting Kenya and finding solutions",
  "I prefer analyzing data and looking for patterns rather than memorizing facts",
  "I like asking 'why' and 'how' questions about natural phenomena around me",
  "I enjoy reading scientific articles and learning about new discoveries",
  
  // Artistic (A) - 5 questions
  "I love expressing myself through drawing, painting, music, or creative writing",
  "I enjoy creating digital content like videos, graphics, or presentations",
  "I like participating in drama, dance, or other performing arts activities",
  "I prefer creative assignments where I can use my imagination freely",
  "I enjoy designing and decorating spaces or creating visual displays",
  
  // Social (S) - 5 questions
  "I enjoy helping classmates understand difficult concepts or solve problems",
  "I like working in groups and collaborating with others on projects",
  "I feel good when I can make someone feel better or solve their problems",
  "I enjoy community service activities and helping people in need",
  "I like teaching younger students or sharing knowledge with others",
  
  // Enterprising (E) - 5 questions
  "I enjoy leading group projects and organizing school events or activities",
  "I like coming up with business ideas and thinking about how to make money",
  "I am comfortable speaking in front of the class or presenting to groups",
  "I enjoy persuading others to join activities or support my ideas",
  "I like taking charge and making important decisions in group situations",
  
  // Conventional (C) - 5 questions
  "I prefer following clear instructions and organized procedures in my work",
  "I enjoy organizing information, creating lists, and keeping detailed records",
  "I like working with numbers, calculations, and mathematical problem-solving",
  "I prefer structured activities with clear rules rather than open-ended tasks",
  "I am good at managing my time, keeping schedules, and meeting deadlines"
];

const riasecMapping = [
  'R','R','R','R','R',  // Realistic (1-5)
  'I','I','I','I','I',  // Investigative (6-10)
  'A','A','A','A','A',  // Artistic (11-15)
  'S','S','S','S','S',  // Social (16-20)
  'E','E','E','E','E',  // Enterprising (21-25)
  'C','C','C','C','C'   // Conventional (26-30)
];

const AssessmentQuestions = ({ userData, onComplete }: AssessmentQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(30).fill(0));

  const handleAnswerSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    answers.forEach((answer, index) => {
      const code = riasecMapping[index] as keyof typeof scores;
      scores[code] += answer;
    });

    const sortedCodes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([code]) => code);

    const topCodes = `${sortedCodes[0]},${sortedCodes[1]}`;

    const assessmentData: AssessmentData = {
      ...userData,
      answers,
      topCodes,
      scores
    };

    onComplete(assessmentData);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CBC Career Interest Assessment - Grade 9
          </h1>
          <Progress value={progress} className="w-full h-3" />
          <p className="text-center mt-2 text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {questions[currentQuestion]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">
                How much do you agree with this statement?
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { value: 1, label: "Strongly Disagree", color: "bg-red-100 hover:bg-red-200 border-red-300" },
                  { value: 2, label: "Disagree", color: "bg-orange-100 hover:bg-orange-200 border-orange-300" },
                  { value: 3, label: "Neutral", color: "bg-gray-100 hover:bg-gray-200 border-gray-300" },
                  { value: 4, label: "Agree", color: "bg-blue-100 hover:bg-blue-200 border-blue-300" },
                  { value: 5, label: "Strongly Agree", color: "bg-green-100 hover:bg-green-200 border-green-300" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerSelect(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${option.color} ${
                      answers[currentQuestion] === option.value ? 'ring-2 ring-blue-500 scale-105' : ''
                    }`}
                  >
                    <div className="font-semibold text-lg">{option.value}</div>
                    <div className="text-sm">{option.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                >
                  {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CBC Context Information */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">About This Assessment</h3>
          <p className="text-blue-700 text-sm">
            This assessment is designed specifically for Grade 9 learners in Kenya's Competency Based Curriculum (CBC). 
            It helps identify your career interests and learning preferences across different competency based curriculum portfolio areas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestions;
