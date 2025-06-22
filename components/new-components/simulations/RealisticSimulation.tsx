import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wrench, CheckCircle, XCircle, SkipForward } from 'lucide-react';

interface RealisticSimulationProps {
  onComplete: (score: number) => void;
  onSkip: () => void;
  onBack: () => void;
}

const practicalActivities = [
  {
    title: "Simple Machine Construction",
    subject: "Science & Technology",
    grade: "Grade 4-6",
    task: "Build a simple lever to lift objects",
    materials: ["Ruler", "Fulcrum", "Small objects"],
    steps: [
      "Place the fulcrum under the ruler",
      "Put the object on one end",
      "Apply force on the other end",
      "Observe the mechanical advantage"
    ],
    question: "What happens when you move the fulcrum closer to the object?",
    options: [
      "It becomes harder to lift",
      "It becomes easier to lift", 
      "No change occurs",
      "The lever breaks"
    ],
    correct: 1,
    explanation: "Moving the fulcrum closer to the load increases mechanical advantage, making it easier to lift."
  },
  {
    title: "Digital Circuits Workshop",
    subject: "Pre-Technical & Pre-Career Education",
    grade: "Grade 7-9",
    task: "Create a simple LED circuit",
    materials: ["LED", "Battery", "Resistor", "Wires"],
    steps: [
      "Connect the positive terminal of battery to LED",
      "Add a resistor in series",
      "Complete the circuit with negative terminal",
      "Test the circuit functionality"
    ],
    question: "Why is a resistor needed in this LED circuit?",
    options: [
      "To make the LED brighter",
      "To protect the LED from excess current",
      "To change the LED color",
      "To save battery power"
    ],
    correct: 1,
    explanation: "A resistor limits current flow, protecting the LED from burning out due to excess current."
  },
  {
    title: "Agricultural Technology",
    subject: "Agriculture",
    grade: "Grade 1-3",
    task: "Design a simple irrigation system",
    materials: ["Plastic bottles", "Tubing", "Small holes"],
    steps: [
      "Make small holes in bottle cap",
      "Fill bottle with water",
      "Connect tubing if available",
      "Test water flow to plants"
    ],
    question: "What controls the water flow in this system?",
    options: [
      "The size of the holes",
      "The color of the bottle",
      "The type of plant",
      "The time of day"
    ],
    correct: 0,
    explanation: "The size and number of holes determine how fast water flows out of the irrigation system."
  }
];

const RealisticSimulation = ({ onComplete, onSkip, onBack }: RealisticSimulationProps) => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);

  const activity = practicalActivities[currentActivity];

  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = [...completedSteps];
    newCompleted[stepIndex] = true;
    setCompletedSteps(newCompleted);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === activity.correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentActivity < practicalActivities.length - 1) {
        setCurrentActivity(currentActivity + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setCompletedSteps([]);
      } else {
        const finalScore = Math.round((score / practicalActivities.length) * 100);
        onComplete(finalScore);
      }
    }, 3000);
  };

  const allStepsCompleted = completedSteps.length === activity.steps.length && 
                           completedSteps.every(step => step === true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              CBC Practical Activities
            </h1>
            <p className="text-gray-600">Hands-on learning with real-world applications</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
            >
              <SkipForward className="w-4 h-4" />
              Skip This
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Activity</p>
              <p className="text-2xl font-bold text-green-600">{currentActivity + 1}/3</p>
            </div>
          </div>
        </div>

        {/* Skip Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Need help?</strong> If you're having difficulty with this practical activity, 
            you can skip it and still complete your assessment. Click "Skip This" to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-green-500" />
                    {activity.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.subject} • {activity.grade}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-green-800 mb-3">Task:</h3>
                <p className="text-green-700 text-lg">{activity.task}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Materials Needed:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {activity.materials.map((material, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      {material}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Steps to Complete:</h3>
                <div className="space-y-3">
                  {activity.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <button
                        onClick={() => handleStepComplete(index)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          completedSteps[index] 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {completedSteps[index] && <CheckCircle className="w-4 h-4" />}
                      </button>
                      <span className={completedSteps[index] ? 'line-through text-gray-500' : ''}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {allStepsCompleted && !showFeedback && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Reflection Question:</h3>
                  <p className="text-gray-700 mb-4">{activity.question}</p>
                  <div className="space-y-2">
                    {activity.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showFeedback && (
                <div className={`p-6 rounded-lg ${selectedAnswer === activity.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {selectedAnswer === activity.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <h3 className={`font-semibold ${selectedAnswer === activity.correct ? 'text-green-800' : 'text-red-800'}`}>
                      {selectedAnswer === activity.correct ? 'Correct!' : 'Incorrect'}
                    </h3>
                  </div>
                  <p className={selectedAnswer === activity.correct ? 'text-green-700' : 'text-red-700'}>
                    {activity.explanation}
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    Moving to next activity...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">CBC Learning Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Science & Technology</h4>
                <p className="text-sm text-blue-700">
                  Developing practical skills through hands-on experiments and real-world problem solving.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Pre-Technical Education</h4>
                <p className="text-sm text-purple-700">
                  Building foundation skills for technical careers through practical activities.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Agriculture</h4>
                <p className="text-sm text-green-700">
                  Learning sustainable farming practices and agricultural technology.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Career Pathways:</h4>
                <div className="space-y-1 text-sm text-yellow-700">
                  <div>• Engineering & Technology</div>
                  <div>• Agricultural Sciences</div>
                  <div>• Technical Training</div>
                  <div>• Applied Sciences</div>
                </div>
              </div>

              <div className="text-center pt-4">
                <div className="text-4xl mb-2">🔧</div>
                <p className="text-gray-600 text-sm">Building practical skills</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealisticSimulation;
