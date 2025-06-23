'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  BookOpen, Brain, Zap, Target, PlayCircle, GraduationCap, 
  TrendingUp, MessageCircle, FileText, Clock, Users, 
  ArrowRight, Star, CheckCircle, AlertCircle, Info, Home
} from 'lucide-react';

export const AdminPreview = () => {
  const navigate = useRouter();
  const [selectedDemo, setSelectedDemo] = useState('assessment-cards');
  const [sampleAnswers, setSampleAnswers] = useState<Record<number, number>>({});
  const [currentAssessmentStep, setCurrentAssessmentStep] = useState(1);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [showCBCSimulation, setShowCBCSimulation] = useState(false);

  // Sample assessment steps with enhanced functionality
  const assessmentSteps = [
    {
      id: 0,
      title: "CBC Learning Areas Assessment",
      description: "Evaluate performance in CBC learning areas (Grades 7-9)",
      icon: BookOpen,
      status: "completed",
      route: "/cbc-assessment"
    },
    {
      id: 1,
      title: "Core Competencies",
      description: "Assess key competencies and values",
      icon: Brain,
      status: "current",
      route: "/unified-assessment"
    },
    {
      id: 2,
      title: "Psychometric Assessment",
      description: "Psychological assessment of cognitive abilities and personality",
      icon: Zap,
      status: "pending",
      route: "/riasec-assessment"
    },
    {
      id: 3,
      title: "CBC Learning Areas Simulation Grade 7-9",
      description: "Interactive simulations for CBC learning areas",
      icon: PlayCircle,
      status: "pending",
      route: "cbc-simulation", // Updated to use internal handling
      isInternal: true
    },
    {
      id: 4,
      title: "Recommended CBE Pathway Grade 10-12",
      description: "AI-powered CBE pathway selection for senior school",
      icon: GraduationCap,
      status: "pending",
      route: null
    },
    {
      id: 5,
      title: "Career Pathway",
      description: "Explore career options and pathways",
      icon: TrendingUp,
      status: "pending",
      route: null
    },
    {
      id: 6,
      title: "AI Career Consultant & Counselling",
      description: "Get personalized career guidance from AI counselor",
      icon: MessageCircle,
      status: "pending",
      route: null
    },
    {
      id: 7,
      title: "Generate Detailed Report",
      description: "Comprehensive assessment report and recommendations",
      icon: FileText,
      status: "pending",
      route: null
    }
  ];

  // Sample pathways with enhanced data
  const cbcPathways = [
    {
      id: "ass",
      name: "Arts and Sports Science (ASS)",
      description: "Creative arts, sports, and performance careers",
      color: "bg-purple-500",
      careers: ["Athlete", "Artist", "Designer", "Musician"],
      demand: "High",
      subjects: ["Physical Education", "Creative Arts", "Music", "Visual Arts"]
    },
    {
      id: "ssc",
      name: "Social Sciences (SSC)",
      description: "Human behavior and society studies",
      color: "bg-blue-500",
      careers: ["Psychologist", "Sociologist", "Counselor", "Social Worker"],
      demand: "Medium",
      subjects: ["History", "Geography", "Religious Education", "Social Studies"]
    },
    {
      id: "stem",
      name: "STEM",
      description: "Science, technology, engineering, mathematics",
      color: "bg-green-500",
      careers: ["Engineer", "Developer", "Scientist", "Researcher"],
      demand: "Very High",
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"]
    },
    {
      id: "lan",
      name: "Languages (LAN)",
      description: "Communication and linguistics",
      color: "bg-yellow-500",
      careers: ["Translator", "Journalist", "Teacher", "Writer"],
      demand: "Medium",
      subjects: ["English", "Kiswahili", "Foreign Languages", "Literature"]
    },
    {
      id: "aps",
      name: "Applied Sciences (APS)",
      description: "Practical scientific applications",
      color: "bg-red-500",
      careers: ["Lab Technician", "Medical Tech", "Food Scientist"],
      demand: "High",
      subjects: ["Applied Chemistry", "Applied Biology", "Food Technology"]
    },
    {
      id: "cte",
      name: "Career and Technical Education (CTE)",
      description: "Vocational and technical skills",
      color: "bg-indigo-500",
      careers: ["Electrician", "Mechanic", "Chef", "IT Support"],
      demand: "High",
      subjects: ["Technical Drawing", "Business Studies", "Agriculture", "Home Science"]
    }
  ];

  // Sample question with enhanced options
  const sampleQuestion = {
    id: 1,
    text: "I enjoy working with my hands to build or repair things",
    category: "Practical Skills",
    options: [
      { value: "5", label: "Completely agree!" },
      { value: "4", label: "Mostly agree" },
      { value: "3", label: "Not sure" },
      { value: "2", label: "Mostly disagree" },
      { value: "1", label: "Completely disagree!" }
    ]
  };

  // Sample simulations with enhanced functionality
  const simulations = [
    {
      id: "math",
      subject: "Mathematics",
      topics: ["Algebra", "Geometry", "Statistics"],
      duration: "45 mins",
      difficulty: "Grade 9",
      status: "available",
      progress: 0
    },
    {
      id: "science",
      subject: "Science & Technology",
      topics: ["Chemistry Lab", "Physics", "Biology"],
      duration: "60 mins",
      difficulty: "Grade 9",
      status: "available",
      progress: 0
    },
    {
      id: "languages",
      subject: "Languages",
      topics: ["English", "Kiswahili", "Creative Writing"],
      duration: "30 mins",
      difficulty: "Grade 9",
      status: "completed",
      progress: 100
    }
  ];

  const handleSampleAnswer = (questionId: number, value: string) => {
    setSampleAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    toast.success(`Answer recorded: ${value} stars`);
  };

  const handleStepClick = (step: any) => {
    console.log('Step clicked:', step);
    
    if (step.isInternal && step.route === 'cbc-simulation') {
      // Handle CBC simulation internally
      setShowCBCSimulation(true);
      setSelectedDemo('cbc-simulation');
      toast.success(`Opening ${step.title}...`);
      return;
    }
    
    if (step.route) {
      toast.info(`Navigating to ${step.title}...`);
      try {
        navigate.push(step.route);
      } catch (error) {
        console.error('Navigation error:', error);
        toast.error('Navigation failed - route may not exist');
      }
    } else {
      setCurrentAssessmentStep(step.id);
      toast.info(`Selected: ${step.title}`);
    }
  };

  const handlePathwaySelect = (pathway: any) => {
    console.log('Pathway selected:', pathway);
    setSelectedPathway(pathway.id);
    toast.success(`Selected pathway: ${pathway.name}`);
  };

  const handleSimulationStart = (simulation: any) => {
    console.log('Simulation started:', simulation);
    setSelectedSimulation(simulation.id);
    if (simulation.status === 'completed') {
      toast.info(`Reviewing results for ${simulation.subject}`);
    } else {
      toast.success(`Starting ${simulation.subject} simulation...`);
    }
  };

  const handleNavigation = (action: string) => {
    console.log('Navigation action:', action);
    switch (action) {
      case 'start-assessment':
        try {
          navigate.push('/assessment/unified-assessment');
          toast.success('Starting Complete Assessment...');
        } catch (error) {
          console.error('Navigation error:', error);
          toast.error('Navigation failed - unified assessment route may not exist');
        }
        break;
      case 'ai-counselor':
        toast.info('AI Career Counselor feature - Demo mode');
        break;
      case 'ai-recommendations':
        toast.info('Generating AI recommendations - Demo mode');
        break;
      case 'generate-report':
        toast.info('Generating comprehensive report - Demo mode');
        break;
      case 'save-progress':
        toast.success('Progress saved successfully!');
        break;
      case 'export-results':
        toast.info('Exporting results - Demo mode');
        break;
      case 'previous':
        toast.info('Previous navigation - Demo mode');
        break;
      case 'next':
        toast.info('Next navigation - Demo mode');
        break;
      case 'complete-assessment':
        toast.success('Assessment completed - Demo mode');
        break;
      case 'reset-progress':
        toast.warning('Progress reset - Demo mode');
        break;
      case 'load-previous':
        toast.info('Loading previous session - Demo mode');
        break;
      case 'print-report':
        toast.info('Printing report - Demo mode');
        break;
      default:
        toast.info(`Action: ${action} - Demo mode`);
    }
  };

  const handleBackToHome = () => {
    console.log('Navigating back to home');
    try {
      navigate.push('/assessment');
      toast.success('Returning to home page...');
    } catch (error) {
      console.error('Home navigation error:', error);
      toast.error('Navigation failed');
    }
  };

  // CBC Simulation Component
  const CBCSimulationDemo = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-blue-600" />
            CBC Learning Areas Simulation (Grade 7-9)
          </CardTitle>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowCBCSimulation(false);
              setSelectedDemo('assessment-cards');
            }}
          >
            Back to Assessment Steps
          </Button>
        </div>
        <CardDescription>
          Interactive simulations across CBC learning areas for Grade 7-9 students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Simulation Overview</h3>
          <p className="text-blue-600 text-sm">
            Complete interactive simulations in Mathematics, Science & Technology, Languages, and Social Studies 
            to assess your learning capabilities across CBC areas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulations.map((sim) => (
            <Card 
              key={sim.id} 
              className={`hover:shadow-lg transition-all ${
                selectedSimulation === sim.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{sim.subject}</CardTitle>
                  <Badge variant={sim.status === 'completed' ? 'default' : 'secondary'}>
                    {sim.status}
                  </Badge>
                </div>
                {sim.progress > 0 && (
                  <div className="mt-2">
                    <Progress value={sim.progress} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">{sim.progress}% complete</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {sim.topics.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Duration: {sim.duration}</span>
                    <span>Level: {sim.difficulty}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    variant={sim.status === 'completed' ? 'outline' : 'default'}
                    onClick={() => handleSimulationStart(sim)}
                  >
                    {sim.status === 'completed' ? 'Review Results' : 'Start Simulation'}
                    <PlayCircle className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Complete at least 2 simulations to proceed to pathway recommendations
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              Save Progress
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              View My Results
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // If CBC simulation is active, show it
  if (showCBCSimulation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                onClick={handleBackToHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
              <h1 className="text-4xl font-bold text-gray-800 flex-1">
                CBC Learning Areas Simulation
              </h1>
              <div className="w-32"></div>
            </div>
            <p className="text-lg text-gray-600">
              Interactive simulations to assess your learning capabilities
            </p>
          </div>
          
          <CBCSimulationDemo />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={handleBackToHome}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-gray-800 flex-1">
              Admin Component Preview Dashboard
            </h1>
            <div className="w-32"></div>
          </div>
          <p className="text-lg text-gray-600">
            Preview and test all assessment components, cards, and interactive elements
          </p>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="assessment-cards">Assessment Steps</TabsTrigger>
            <TabsTrigger value="pathway-cards">Pathway Cards</TabsTrigger>
            <TabsTrigger value="question-demo">Question Flow</TabsTrigger>
            <TabsTrigger value="simulation-cards">Simulations</TabsTrigger>
            <TabsTrigger value="navigation-demo">Navigation</TabsTrigger>
            <TabsTrigger value="status-demo">Status & Badges</TabsTrigger>
          </TabsList>

          {/* Assessment Steps Cards */}
          <TabsContent value="assessment-cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Step Navigation Cards</CardTitle>
                <CardDescription>
                  Interactive step cards showing progress and current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Assessment Progress</span>
                    <span className="text-sm text-gray-600">Step {currentAssessmentStep + 1} of {assessmentSteps.length}</span>
                  </div>
                  <Progress value={(currentAssessmentStep / assessmentSteps.length) * 100} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {assessmentSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = step.status === 'current' || currentAssessmentStep === step.id;
                    const isCompleted = step.status === 'completed' || currentAssessmentStep > step.id;
                    
                    return (
                      <Card 
                        key={index}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          isActive ? 'ring-2 ring-blue-500 shadow-lg' : 
                          isCompleted ? 'bg-green-50 border-green-200' : 'opacity-60 hover:opacity-80'
                        }`}
                        onClick={() => handleStepClick(step)}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${
                            isActive ? 'text-blue-500' : 
                            isCompleted ? 'text-green-500' : 'text-gray-400'
                          }`} />
                          <h3 className="font-medium text-sm mb-1">{step.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                          {isCompleted && <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />}
                          {isActive && <Clock className="w-4 h-4 text-blue-500 mx-auto" />}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pathway Cards */}
          <TabsContent value="pathway-cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CBC Pathway Selection Cards</CardTitle>
                <CardDescription>
                  Interactive pathway cards for Grade 10-12 selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPathway && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Selected Pathway</h3>
                    <p className="text-blue-600">
                      {cbcPathways.find(p => p.id === selectedPathway)?.name}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cbcPathways.map((pathway) => (
                    <Card 
                      key={pathway.id}
                      className={`cursor-pointer hover:shadow-lg transition-all border-l-4 ${
                        selectedPathway === pathway.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                      }`}
                      style={{ borderLeftColor: pathway.color.replace('bg-', '#') }}
                      onClick={() => handlePathwaySelect(pathway)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{pathway.name}</CardTitle>
                          <Badge variant={
                            pathway.demand === 'Very High' ? 'default' :
                            pathway.demand === 'High' ? 'secondary' : 'outline'
                          }>
                            {pathway.demand} Demand
                          </Badge>
                        </div>
                        <CardDescription>{pathway.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Sample Careers:</h4>
                            <div className="flex flex-wrap gap-1">
                              {pathway.careers.map((career, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {career}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Key Subjects:</h4>
                            <div className="flex flex-wrap gap-1">
                              {pathway.subjects.map((subject, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button className="w-full mt-3" size="sm">
                            Explore This Pathway <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Demo */}
          <TabsContent value="question-demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Question Interface</CardTitle>
                <CardDescription>
                  Interactive question format with 5-point scale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Question 1 of 60</h3>
                      <p className="text-sm text-gray-600">Category: {sampleQuestion.category}</p>
                    </div>
                    <div className="text-right">
                      <Clock className="w-5 h-5 text-green-600 inline mr-1" />
                      <span className="text-green-600 font-medium">58:45</span>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6 text-center">
                        {sampleQuestion.text}
                      </h2>
                      
                      <RadioGroup 
                        value={sampleAnswers[sampleQuestion.id]?.toString() || ''} 
                        onValueChange={(value) => handleSampleAnswer(sampleQuestion.id, value)}
                        className="space-y-3"
                      >
                        {sampleQuestion.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border">
                            <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                            <Label 
                              htmlFor={`option-${option.value}`} 
                              className="flex-1 cursor-pointer font-medium"
                            >
                              {option.label}
                            </Label>
                            <div className="flex">
                              {[...Array(parseInt(option.value))].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => toast.info('Previous question')}>
                      Previous Question
                    </Button>
                    <Button 
                      disabled={!sampleAnswers[sampleQuestion.id]}
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => toast.success('Moving to next question')}
                    >
                      Next Question
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulations */}
          <TabsContent value="simulation-cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Area Simulations</CardTitle>
                <CardDescription>
                  Interactive subject simulations for Grade 7-9
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSimulation && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800">Active Simulation</h3>
                    <p className="text-green-600">
                      {simulations.find(s => s.id === selectedSimulation)?.subject}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {simulations.map((sim) => (
                    <Card 
                      key={sim.id} 
                      className={`hover:shadow-lg transition-all ${
                        selectedSimulation === sim.id ? 'ring-2 ring-green-500 shadow-lg' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{sim.subject}</CardTitle>
                          <Badge variant={sim.status === 'completed' ? 'default' : 'secondary'}>
                            {sim.status}
                          </Badge>
                        </div>
                        {sim.progress > 0 && (
                          <div className="mt-2">
                            <Progress value={sim.progress} className="h-2" />
                            <p className="text-xs text-gray-600 mt-1">{sim.progress}% complete</p>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Topics Covered:</h4>
                            <div className="flex flex-wrap gap-1">
                              {sim.topics.map((topic, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Duration: {sim.duration}</span>
                            <span>Level: {sim.difficulty}</span>
                          </div>
                          <Button 
                            className="w-full" 
                            variant={sim.status === 'completed' ? 'outline' : 'default'}
                            onClick={() => handleSimulationStart(sim)}
                          >
                            {sim.status === 'completed' ? 'Review Results' : 'Start Simulation'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Demo */}
          <TabsContent value="navigation-demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Elements</CardTitle>
                <CardDescription>
                  Various navigation buttons and controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Navigation */}
                <div>
                  <h3 className="font-semibold mb-3">Primary Navigation Buttons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => handleNavigation('start-assessment')}>
                      Start Assessment
                    </Button>
                    <Button variant="outline" onClick={() => handleNavigation('previous')}>
                      Previous
                    </Button>
                    <Button variant="outline" onClick={() => handleNavigation('next')}>
                      Next
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleNavigation('complete-assessment')}
                    >
                      Complete Assessment
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleNavigation('reset-progress')}
                    >
                      Reset Progress
                    </Button>
                  </div>
                </div>

                {/* Secondary Actions */}
                <div>
                  <h3 className="font-semibold mb-3">Secondary Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNavigation('save-progress')}
                    >
                      Save Progress
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNavigation('load-previous')}
                    >
                      Load Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNavigation('export-results')}
                    >
                      Export Results
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNavigation('print-report')}
                    >
                      Print Report
                    </Button>
                  </div>
                </div>

                {/* AI Features */}
                <div>
                  <h3 className="font-semibold mb-3">AI-Powered Features</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleNavigation('ai-counselor')}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      AI Career Counselor
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleNavigation('ai-recommendations')}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Get AI Recommendations
                    </Button>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleNavigation('generate-report')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate AI Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status & Badges */}
          <TabsContent value="status-demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Indicators & Badges</CardTitle>
                <CardDescription>
                  Various status indicators used throughout the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assessment Status */}
                <div>
                  <h3 className="font-semibold mb-3">Assessment Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Completed</Badge>
                    <Badge variant="secondary">In Progress</Badge>
                    <Badge variant="outline">Not Started</Badge>
                    <Badge variant="destructive">Incomplete</Badge>
                  </div>
                </div>

                {/* Career Demand */}
                <div>
                  <h3 className="font-semibold mb-3">Career Market Demand</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500">Very High Demand</Badge>
                    <Badge className="bg-blue-500">High Demand</Badge>
                    <Badge className="bg-yellow-500 text-black">Medium Demand</Badge>
                    <Badge variant="outline">Low Demand</Badge>
                  </div>
                </div>

                {/* User Types */}
                <div>
                  <h3 className="font-semibold mb-3">User Types</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-500">Grade 9 Student</Badge>
                    <Badge className="bg-blue-500">Teacher</Badge>
                    <Badge className="bg-orange-500">Parent</Badge>
                    <Badge className="bg-red-500">Admin</Badge>
                  </div>
                </div>

                {/* Alert Types */}
                <div>
                  <h3 className="font-semibold mb-3">Alert Indicators</h3>
                  <div className="flex flex-wrap gap-3">
                    <div 
                      className="flex items-center gap-2 p-2 bg-green-100 rounded cursor-pointer hover:bg-green-200"
                      onClick={() => toast.success('Assessment Complete!')}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-700">Assessment Complete</span>
                    </div>
                    <div 
                      className="flex items-center gap-2 p-2 bg-yellow-100 rounded cursor-pointer hover:bg-yellow-200"
                      onClick={() => toast.warning('Time Running Low!')}
                    >
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-700">Time Running Low</span>
                    </div>
                    <div 
                      className="flex items-center gap-2 p-2 bg-blue-100 rounded cursor-pointer hover:bg-blue-200"
                      onClick={() => toast.info('New Recommendation Available!')}
                    >
                      <Info className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-700">New Recommendation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
