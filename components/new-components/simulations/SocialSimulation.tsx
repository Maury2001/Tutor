import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageCircle, SkipForward } from 'lucide-react';

interface SocialSimulationProps {
  onComplete: (score: number) => void;
  onSkip: () => void;
  onBack: () => void;
}

const scenarios = [
  {
    situation: "A student approaches you looking upset and says they're being bullied at school.",
    responses: [
      { text: "That's terrible! You should fight back to show them you're not weak.", empathy: 1, effectiveness: 1 },
      { text: "I understand how difficult this must be for you. Can you tell me more about what's happening?", empathy: 5, effectiveness: 5 },
      { text: "Just ignore them and they'll eventually stop bothering you.", empathy: 2, effectiveness: 2 },
      { text: "Bullying is serious. Let's talk about strategies to address this safely and get help from adults.", empathy: 4, effectiveness: 5 }
    ]
  },
  {
    situation: "A colleague seems overwhelmed with their workload and mentions they're having trouble sleeping.",
    responses: [
      { text: "Everyone gets stressed sometimes. You'll get through it.", empathy: 2, effectiveness: 2 },
      { text: "I can see you're really struggling. Would it help to talk about what's making it most difficult?", empathy: 5, effectiveness: 4 },
      { text: "Have you tried just working faster to get things done?", empathy: 1, effectiveness: 1 },
      { text: "That sounds really challenging. Maybe we could brainstorm some time management strategies together?", empathy: 4, effectiveness: 5 }
    ]
  },
  {
    situation: "A friend shares that they're feeling anxious about an upcoming job interview.",
    responses: [
      { text: "Don't worry about it - what's the worst that could happen?", empathy: 2, effectiveness: 2 },
      { text: "Job interviews are always nerve-wracking. Would you like to practice some questions together?", empathy: 4, effectiveness: 5 },
      { text: "I understand you're feeling anxious. That's completely normal before something important.", empathy: 5, effectiveness: 4 },
      { text: "You're probably overthinking it. Just be yourself and you'll be fine.", empathy: 3, effectiveness: 3 }
    ]
  }
];

const SocialSimulation = ({ onComplete, onSkip, onBack }: SocialSimulationProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [totalEmpathy, setTotalEmpathy] = useState(0);
  const [totalEffectiveness, setTotalEffectiveness] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleResponseSelect = (responseIndex: number) => {
    const response = scenarios[currentScenario].responses[responseIndex];
    const newResponses = [...responses, responseIndex];
    setResponses(newResponses);
    
    const newEmpathy = totalEmpathy + response.empathy;
    const newEffectiveness = totalEffectiveness + response.effectiveness;
    setTotalEmpathy(newEmpathy);
    setTotalEffectiveness(newEffectiveness);

    // Provide feedback
    let feedbackText = '';
    if (response.empathy >= 4 && response.effectiveness >= 4) {
      feedbackText = 'Excellent response! You showed great empathy and provided effective help.';
    } else if (response.empathy >= 4) {
      feedbackText = 'Good empathy! You understood their feelings well.';
    } else if (response.effectiveness >= 4) {
      feedbackText = 'Practical response! You offered helpful solutions.';
    } else {
      feedbackText = 'Consider how you might show more understanding and offer better support.';
    }
    
    setFeedback(feedbackText);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setShowFeedback(false);
        setFeedback('');
      } else {
        // Calculate final score
        const maxPossible = scenarios.length * 10; // 5 empathy + 5 effectiveness per scenario
        const finalScore = Math.round(((newEmpathy + newEffectiveness) / maxPossible) * 100);
        onComplete(finalScore);
      }
    }, 2500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Empathy & Communication
            </h1>
            <p className="text-gray-600">Practice helping others through difficult situations</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <SkipForward className="w-4 h-4" />
              Skip This
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-orange-600">{currentScenario + 1}/3</p>
            </div>
          </div>
        </div>

        {/* Skip Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Having trouble?</strong> You can skip this simulation and still get your final report. 
            Click "Skip This" at any time to move on to the next activity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-orange-500" />
                Scenario {currentScenario + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-orange-800 mb-3">Situation:</h3>
                <p className="text-orange-700 text-lg leading-relaxed">
                  {currentScenarioData.situation}
                </p>
              </div>

              {!showFeedback ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4">How do you respond?</h3>
                  <div className="space-y-3">
                    {currentScenarioData.responses.map((response, index) => (
                      <button
                        key={index}
                        onClick={() => handleResponseSelect(index)}
                        className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-all"
                      >
                        {response.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Feedback:</h3>
                  <p className="text-blue-700 text-lg">{feedback}</p>
                  <div className="mt-4 text-sm text-blue-600">
                    Moving to next scenario...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Social Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Your Empathy Score:</h4>
                <div className="bg-red-100 rounded-full h-3 mb-2">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(totalEmpathy / (scenarios.length * 5)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{totalEmpathy}/{scenarios.length * 5}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Effectiveness Score:</h4>
                <div className="bg-orange-100 rounded-full h-3 mb-2">
                  <div 
                    className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(totalEffectiveness / (scenarios.length * 5)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{totalEffectiveness}/{scenarios.length * 5}</p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-pink-800 mb-2">Social Careers:</h4>
                <div className="space-y-1 text-sm">
                  {[
                    'Counselor',
                    'Social Worker',
                    'Therapist',
                    'Teacher',
                    'Nurse',
                    'Community Organizer'
                  ].map((career, index) => (
                    <div key={index} className="text-pink-700">• {career}</div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Key Skills:</h4>
                <div className="space-y-1 text-sm text-yellow-700">
                  <div>• Active listening</div>
                  <div>• Emotional intelligence</div>
                  <div>• Communication</div>
                  <div>• Problem-solving</div>
                  <div>• Conflict resolution</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-2">🤝</div>
                <p className="text-gray-600 text-sm">
                  Helping others succeed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialSimulation;
