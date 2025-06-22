
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Microscope, CheckCircle, Brain } from 'lucide-react';

interface InvestigativeSimulationProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const investigations = [
  {
    title: "Water Quality Investigation",
    subject: "Environmental Activities",
    grade: "Grade 4-6",
    scenario: "Students need to test water samples from different sources in their community to determine which is safest for drinking.",
    hypothesis: "River water will be less clean than borehole water",
    materials: ["pH strips", "Turbidity tubes", "Thermometer", "Magnifying glass"],
    observations: [
      "River water appears cloudy",
      "Borehole water is clear",
      "pH of river water: 6.5",
      "pH of borehole water: 7.2",
      "River water temperature: 25°C",
      "Borehole water temperature: 22°C"
    ],
    question: "Based on the observations, which conclusion is most scientific?",
    options: [
      "River water is dirty because it looks cloudy",
      "Borehole water is safer due to neutral pH and clarity",
      "Temperature shows river water is better",
      "Both water sources are exactly the same"
    ],
    correct: 1,
    explanation: "Scientific conclusions should be based on multiple data points. The borehole water shows better pH balance and clarity."
  },
  {
    title: "Plant Growth Experiment",
    subject: "Science & Technology",
    grade: "Grade 1-3",
    scenario: "Investigation of how different conditions affect plant growth over 2 weeks.",
    hypothesis: "Plants with more sunlight will grow taller",
    materials: ["Bean seeds", "Pots", "Soil", "Water", "Ruler"],
    observations: [
      "Plant A (full sun): 15cm tall, green leaves",
      "Plant B (shade): 8cm tall, pale leaves", 
      "Plant C (no light): 3cm tall, yellow leaves",
      "All plants watered equally daily",
      "Same soil and pot size used",
      "Temperature was constant"
    ],
    question: "What can we conclude from this investigation?",
    options: [
      "All plants grow at the same rate",
      "Sunlight is important for healthy plant growth",
      "Water is not needed for plant growth",
      "Plants grow better in darkness"
    ],
    correct: 1,
    explanation: "The data shows plants with more sunlight grew taller and healthier, supporting our hypothesis."
  },
  {
    title: "Weather Pattern Analysis",
    subject: "Geography",
    grade: "Grade 7-9",
    scenario: "Analyze local weather data collected over a month to identify patterns and make predictions.",
    hypothesis: "Rainfall increases during certain times of the month",
    materials: ["Weather data charts", "Calculator", "Graph paper", "Thermometer readings"],
    observations: [
      "Week 1: 5mm rainfall, 28°C average",
      "Week 2: 15mm rainfall, 25°C average",
      "Week 3: 25mm rainfall, 23°C average", 
      "Week 4: 8mm rainfall, 27°C average",
      "Humidity increased with rainfall",
      "Wind patterns changed weekly"
    ],
    question: "What pattern can be identified from this weather data?",
    options: [
      "No pattern exists in the data",
      "Rainfall and temperature are inversely related",
      "Weather is completely random",
      "Temperature always increases"
    ],
    correct: 1,
    explanation: "The data shows that as rainfall increases, temperature tends to decrease, indicating an inverse relationship."
  }
];

const InvestigativeSimulation = ({ onComplete, onBack }: InvestigativeSimulationProps) => {
  const [currentInvestigation, setCurrentInvestigation] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [viewedObservations, setViewedObservations] = useState<boolean[]>([]);

  const investigation = investigations[currentInvestigation];

  const handleObservationView = (index: number) => {
    const newViewed = [...viewedObservations];
    newViewed[index] = true;
    setViewedObservations(newViewed);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === investigation.correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentInvestigation < investigations.length - 1) {
        setCurrentInvestigation(currentInvestigation + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setViewedObservations([]);
      } else {
        const finalScore = Math.round(((score + (answerIndex === investigation.correct ? 1 : 0)) / investigations.length) * 100);
        onComplete(finalScore);
      }
    }, 3000);
  };

  const allObservationsViewed = viewedObservations.length === investigation.observations.length && 
                               viewedObservations.every(viewed => viewed === true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CBC Scientific Investigation
            </h1>
            <p className="text-gray-600">Developing inquiry and analytical thinking skills</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Investigation</p>
            <p className="text-2xl font-bold text-blue-600">{currentInvestigation + 1}/3</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="w-6 h-6 text-blue-500" />
                {investigation.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {investigation.subject} • {investigation.grade}
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-3">Investigation Scenario:</h3>
                <p className="text-blue-700 mb-4">{investigation.scenario}</p>
                <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                  <strong>Hypothesis:</strong> {investigation.hypothesis}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Materials & Equipment:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {investigation.materials.map((material, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      {material}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Observations & Data:</h3>
                <div className="space-y-2">
                  {investigation.observations.map((observation, index) => (
                    <button
                      key={index}
                      onClick={() => handleObservationView(index)}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        viewedObservations[index] 
                          ? 'bg-green-50 border-green-300 text-green-800' 
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {viewedObservations[index] && <CheckCircle className="w-5 h-5 text-green-600" />}
                        <span>{observation}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {allObservationsViewed && !showFeedback && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Analysis & Conclusion:
                  </h3>
                  <p className="text-gray-700 mb-4">{investigation.question}</p>
                  <div className="space-y-2">
                    {investigation.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showFeedback && (
                <div className={`p-6 rounded-lg ${selectedAnswer === investigation.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className={`w-6 h-6 ${selectedAnswer === investigation.correct ? 'text-green-600' : 'text-red-600'}`} />
                    <h3 className={`font-semibold ${selectedAnswer === investigation.correct ? 'text-green-800' : 'text-red-800'}`}>
                      {selectedAnswer === investigation.correct ? 'Excellent Scientific Thinking!' : 'Good Attempt!'}
                    </h3>
                  </div>
                  <p className={selectedAnswer === investigation.correct ? 'text-green-700' : 'text-red-700'}>
                    {investigation.explanation}
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    Moving to next investigation...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">CBC Scientific Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Observation Skills</h4>
                <p className="text-sm text-blue-700">
                  Carefully recording what you see, measure, and notice during investigations.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Data Analysis</h4>
                <p className="text-sm text-purple-700">
                  Looking for patterns and relationships in collected information.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Scientific Thinking</h4>
                <p className="text-sm text-green-700">
                  Drawing logical conclusions based on evidence and observations.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Career Pathways:</h4>
                <div className="space-y-1 text-sm text-yellow-700">
                  <div>• Research Scientist</div>
                  <div>• Environmental Scientist</div>
                  <div>• Data Analyst</div>
                  <div>• Laboratory Technician</div>
                  <div>• Agricultural Researcher</div>
                </div>
              </div>

              <div className="text-center pt-4">
                <div className="text-4xl mb-2">🔬</div>
                <p className="text-gray-600 text-sm">Discovering through inquiry</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestigativeSimulation;
