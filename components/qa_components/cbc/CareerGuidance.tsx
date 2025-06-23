'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Compass, Briefcase, GraduationCap, TrendingUp, MessageCircle, Bot, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const cbcPathways = [
  {
    name: "Arts and Sports Science",
    code: "ASS",
    description: "Creative arts, sports, and related sciences for holistic development",
    careers: ["Graphic Designer", "Sports Coach", "Art Teacher", "Physiotherapist", "Event Planner", "Music Producer"],
    subjects: ["Creative Arts & Design", "Physical & Health Education", "Psychology", "Biology", "Kiswahili"],
    clusters: ["Creative Arts Cluster", "Sports & Recreation Cluster"],
    pathwayCode: "10.1"
  },
  {
    name: "Social Sciences",
    code: "SSC", 
    description: "Study of human behavior, society, culture and social relationships",
    careers: ["Social Worker", "Lawyer", "Journalist", "Diplomat", "Historian", "Anthropologist"],
    subjects: ["History & Government", "Geography", "Psychology", "Sociology", "Religious Studies"],
    clusters: ["Social Sciences Cluster", "Communication Cluster"],
    pathwayCode: "10.2"
  },
  {
    name: "Science, Technology, Engineering and Mathematics (STEM)",
    code: "STEM",
    description: "Mathematical, scientific and technological disciplines for innovation",
    careers: ["Engineer", "Doctor", "Data Scientist", "Architect", "Software Developer", "Research Scientist"],
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    clusters: ["STEM Cluster", "Technology Cluster", "Health Sciences Cluster"],
    pathwayCode: "10.3"
  },
  {
    name: "Languages",
    code: "LAN",
    description: "Communication, linguistics, literature and language studies",
    careers: ["Translator", "Teacher", "Writer", "Diplomat", "Content Creator", "Language Specialist"],
    subjects: ["English", "Kiswahili", "Foreign Languages", "Literature", "Communication"],
    clusters: ["Languages Cluster", "Communication Cluster"],
    pathwayCode: "10.4"
  },
  {
    name: "Applied Sciences",
    code: "APS",
    description: "Practical application of scientific knowledge in real-world contexts",
    careers: ["Laboratory Technician", "Agricultural Officer", "Nutritionist", "Environmental Scientist"],
    subjects: ["Agriculture", "Home Science", "Environmental Science", "Applied Biology"],
    clusters: ["Applied Sciences Cluster", "Agriculture Cluster"],
    pathwayCode: "10.5"
  },
  {
    name: "Career and Technical Education",
    code: "CTE",
    description: "Practical skills, vocational training and technical competencies",
    careers: ["Electrician", "Plumber", "Mechanic", "ICT Specialist", "Entrepreneur", "Craftsperson"],
    subjects: ["Technical Studies", "Business Studies", "Computer Studies", "Entrepreneurship"],
    clusters: ["Technical Education Cluster", "Business Cluster"],
    pathwayCode: "10.6"
  }
];

export const CareerGuidance = () => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    grade: '',
    interests: '',
    question: ''
  });
  const [showConsultation, setShowConsultation] = useState(false);
  const { toast } = useToast();

  const handleConsultation = async () => {
    if (!consultationForm.name || !consultationForm.question) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and question for AI consultation.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "AI Consultation Submitted",
      description: "Our AI career counselor will provide personalized guidance shortly.",
    });

    setConsultationForm({ name: '', grade: '', interests: '', question: '' });
    setShowConsultation(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            CBC Career Guidance & AI Consultation Platform
          </CardTitle>
          <CardDescription>
            Explore Grade 10-12 pathways aligned with CBC curriculum and get personalized AI career guidance
          </CardDescription>
        </CardHeader>
      </Card>

      {/* AI Consultation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Bot className="w-5 h-5" />
              AI Career Counselor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Get personalized career advice based on your CBC assessment results and interests.
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowConsultation(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start AI Consultation
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Users className="w-5 h-5" />
              Pathway Navigator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Interactive pathway exploration with detailed career clusters and learning areas.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-green-600 text-green-700 hover:bg-green-50"
            >
              <Compass className="w-4 h-4 mr-2" />
              Explore Pathways
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <FileText className="w-5 h-5" />
              Assessment Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Generate comprehensive reports for students based on Grade 7-9 assessments.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-purple-600 text-purple-700 hover:bg-purple-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Consultation Modal */}
      {showConsultation && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              AI Career Consultation
            </CardTitle>
            <CardDescription>
              Get personalized guidance from our AI career counselor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={consultationForm.name}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Grade</label>
                <Input
                  value={consultationForm.grade}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, grade: e.target.value }))}
                  placeholder="e.g., Grade 9"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Your Interests & Strengths</label>
              <Textarea
                value={consultationForm.interests}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, interests: e.target.value }))}
                placeholder="Tell us about your interests, hobbies, and subjects you enjoy..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Your Question</label>
              <Textarea
                value={consultationForm.question}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, question: e.target.value }))}
                placeholder="What would you like guidance on? Career options, pathway selection, subject choices..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConsultation} className="flex-1">
                <Bot className="w-4 h-4 mr-2" />
                Get AI Guidance
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowConsultation(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CBC Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cbcPathways.map((pathway) => (
          <Card 
            key={pathway.code}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPathway === pathway.code ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setSelectedPathway(
              selectedPathway === pathway.code ? null : pathway.code
            )}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{pathway.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{pathway.code}</Badge>
                    <Badge variant="secondary">{pathway.pathwayCode}</Badge>
                  </div>
                </div>
                <GraduationCap className="w-6 h-6 text-blue-500" />
              </div>
              <CardDescription>{pathway.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    Career Opportunities ({pathway.careers.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pathway.careers.slice(0, 3).map((career, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                    {pathway.careers.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{pathway.careers.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Learning Areas
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pathway.subjects.slice(0, 2).map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {pathway.subjects.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{pathway.subjects.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Pathway Information */}
      {selectedPathway && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>
              Detailed Information: {cbcPathways.find(p => p.code === selectedPathway)?.name}
            </CardTitle>
            <CardDescription>
              Complete pathway guide with careers, subjects, and clusters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const pathway = cbcPathways.find(p => p.code === selectedPathway);
              return pathway ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      All Career Opportunities
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {pathway.careers.map((career, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-green-500" />
                      Grade 10-12 Learning Areas
                    </h4>
                    <div className="space-y-2">
                      {pathway.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <GraduationCap className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      Career Clusters & Codes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pathway.clusters.map((cluster, index) => (
                        <Badge key={index} variant="outline" className="p-2">
                          {cluster}
                        </Badge>
                      ))}
                      <Badge className="p-2">
                        Pathway Code: {pathway.pathwayCode}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
            
            <div className="mt-6 pt-4 border-t">
              <Button className="w-full" onClick={() => setShowConsultation(true)}>
                <Bot className="w-4 h-4 mr-2" />
                Get Personalized AI Consultation for This Pathway
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
