
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette, Music, Camera, Paintbrush } from 'lucide-react';

interface ArtisticSimulationProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const creativeProjects = [
  {
    title: "Traditional Kenyan Art Creation",
    subject: "Creative Arts",
    grade: "Grade 1-3",
    medium: "Visual Arts",
    description: "Create artwork inspired by traditional Kenyan patterns and symbols",
    techniques: ["Pattern making", "Color mixing", "Cultural symbols", "Storytelling through art"],
    steps: [
      "Research traditional Kenyan patterns (geometric, nature-inspired)",
      "Choose colors that represent Kenya (red, black, green, white)",
      "Create your own pattern using traditional elements",
      "Add personal meaning or story to your artwork"
    ],
    reflection: "How does your artwork tell a story about Kenyan culture?",
    options: [
      "It uses colors from the flag only",
      "It combines traditional patterns with personal meaning",
      "It copies exactly what others have done",
      "It doesn't relate to culture at all"
    ],
    correct: 1,
    explanation: "Great art combines traditional elements with personal expression to create meaningful cultural connections."
  },
  {
    title: "School Performance Planning",
    subject: "Music & Movement",
    grade: "Grade 4-6", 
    medium: "Performing Arts",
    description: "Plan and organize a cultural performance for school assembly",
    techniques: ["Choreography", "Music selection", "Costume design", "Audience engagement"],
    steps: [
      "Select appropriate traditional or contemporary Kenyan music",
      "Design simple but meaningful dance movements",
      "Plan costumes that reflect the theme",
      "Practice coordinating with team members"
    ],
    reflection: "What makes a performance engaging for the audience?",
    options: [
      "Loud music and bright colors only",
      "Clear storytelling, coordinated movement, and cultural relevance",
      "Complex moves that are hard to follow",
      "Performing alone without preparation"
    ],
    correct: 1,
    explanation: "Engaging performances combine clear storytelling, good coordination, and meaningful cultural content."
  },
  {
    title: "Digital Storytelling Project",
    subject: "Digital Literacy & Creative Arts",
    grade: "Grade 7-9",
    medium: "Digital Arts",
    description: "Create a digital story about community heroes using available technology",
    techniques: ["Digital photography", "Story structure", "Image editing", "Presentation skills"],
    steps: [
      "Interview a community hero (teacher, health worker, etc.)",
      "Take photos that support your story",
      "Organize content with clear beginning, middle, end",
      "Present your story using available technology"
    ],
    reflection: "How does digital media help tell stories more effectively?",
    options: [
      "It makes stories more complicated",
      "It combines visual, text, and audio elements for richer storytelling",
      "It replaces the need for good content",
      "It only works with expensive equipment"
    ],
    correct: 1,
    explanation: "Digital media enhances storytelling by combining multiple elements to create richer, more engaging narratives."
  }
];

const ArtisticSimulation = ({ onComplete, onBack }: ArtisticSimulationProps) => {
  const [currentProject, setCurrentProject] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [creativity, setCreativity] = useState(0);

  const project = creativeProjects[currentProject];

  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = [...completedSteps];
    newCompleted[stepIndex] = true;
    setCompletedSteps(newCompleted);
    setCreativity(creativity + 25);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === project.correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentProject < creativeProjects.length - 1) {
        setCurrentProject(currentProject + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setCompletedSteps([]);
      } else {
        const finalScore = Math.round(((score + (answerIndex === project.correct ? 1 : 0)) / creativeProjects.length) * 100);
        onComplete(finalScore);
      }
    }, 3000);
  };

  const allStepsCompleted = completedSteps.length === project.steps.length && 
                           completedSteps.every(step => step === true);

  const getIcon = () => {
    switch (project.medium) {
      case 'Visual Arts': return <Paintbrush className="w-6 h-6 text-purple-500" />;
      case 'Performing Arts': return <Music className="w-6 h-6 text-purple-500" />;
      case 'Digital Arts': return <Camera className="w-6 h-6 text-purple-500" />;
      default: return <Palette className="w-6 h-6 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CBC Creative Arts Studio
            </h1>
            <p className="text-gray-600">Expressing creativity through Kenyan cultural lens</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Project</p>
            <p className="text-2xl font-bold text-purple-600">{currentProject + 1}/3</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getIcon()}
                {project.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {project.subject} • {project.grade} • {project.medium}
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-purple-800 mb-3">Creative Challenge:</h3>
                <p className="text-purple-700 text-lg mb-4">{project.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Techniques to Explore:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {project.techniques.map((technique, index) => (
                    <div key={index} className="bg-pink-100 rounded-lg px-3 py-2 text-sm text-pink-800">
                      {technique}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Creative Process Steps:</h3>
                <div className="space-y-3">
                  {project.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <button
                        onClick={() => handleStepComplete(index)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                          completedSteps[index] 
                            ? 'bg-purple-500 border-purple-500 text-white' 
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {completedSteps[index] && '✓'}
                      </button>
                      <div className={`flex-1 p-3 rounded-lg ${
                        completedSteps[index] 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-50'
                      }`}>
                        <span className={completedSteps[index] ? 'font-medium' : ''}>
                          {step}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {allStepsCompleted && !showFeedback && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Creative Reflection:</h3>
                    <p className="text-gray-700 mb-4">{project.reflection}</p>
                  </div>
                  <div className="space-y-2">
                    {project.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showFeedback && (
                <div className={`p-6 rounded-lg ${selectedAnswer === project.correct ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <h3 className={`font-semibold mb-3 ${selectedAnswer === project.correct ? 'text-green-800' : 'text-orange-800'}`}>
                    {selectedAnswer === project.correct ? 'Excellent Creative Thinking!' : 'Good Creative Exploration!'}
                  </h3>
                  <p className={selectedAnswer === project.correct ? 'text-green-700' : 'text-orange-700'}>
                    {project.explanation}
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    Moving to next creative project...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-500" />
                Creative Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Creativity Level:</h4>
                <div className="bg-purple-100 rounded-full h-4 mb-2">
                  <div 
                    className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(creativity, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{Math.min(creativity, 100)}/100</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">CBC Creative Arts</h4>
                <p className="text-sm text-blue-700">
                  Developing creativity while connecting to Kenyan culture and values.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Skills Developed:</h4>
                <div className="space-y-1 text-sm text-green-700">
                  <div>• Cultural appreciation</div>
                  <div>• Creative expression</div>
                  <div>• Digital literacy</div>
                  <div>• Storytelling</div>
                  <div>• Collaboration</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Career Pathways:</h4>
                <div className="space-y-1 text-sm text-yellow-700">
                  <div>• Graphic Designer</div>
                  <div>• Cultural Artist</div>
                  <div>• Digital Content Creator</div>
                  <div>• Arts Teacher</div>
                  <div>• Media Producer</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-2">🎨</div>
                <p className="text-gray-600 text-sm">
                  Creating with purpose
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArtisticSimulation;
