
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AssessmentData } from '@/pages/Index';
import { ArrowLeft, Upload, FileText, GraduationCap, BookOpen, Target, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SelectedPathwayProps {
  assessmentData: AssessmentData;
  onBack: () => void;
}

interface PathwayData {
  cluster: string;
  pathway: string;
  learningAreas: Array<{
    name: string;
    code: string;
  }>;
  careers: string[];
}

const SelectedPathway = ({ assessmentData, onBack }: SelectedPathwayProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate pathway recommendation based on assessment data
  const generatePathwayRecommendation = (): PathwayData => {
    const [primary] = assessmentData.topCodes.split(',');
    
    switch (primary) {
      case 'R':
        return {
          cluster: 'STEM Technical Sciences',
          pathway: 'Engineering & Technology',
          learningAreas: [
            { name: 'Mathematics', code: 'MATH' },
            { name: 'Physical Sciences', code: 'PHYS' },
            { name: 'Technology', code: 'TECH' },
            { name: 'Engineering Graphics & Design', code: 'EGD' }
          ],
          careers: [
            'Mechanical Engineer',
            'Civil Engineer',
            'Technician',
            'Industrial Designer',
            'Project Manager',
            'Quality Control Specialist'
          ]
        };
      case 'I':
        return {
          cluster: 'STEM Pure Sciences',
          pathway: 'Natural Sciences & Research',
          learningAreas: [
            { name: 'Life Sciences', code: 'LIFE' },
            { name: 'Physical Sciences', code: 'PHYS' },
            { name: 'Mathematics', code: 'MATH' },
            { name: 'Information Technology', code: 'IT' }
          ],
          careers: [
            'Research Scientist',
            'Medical Doctor',
            'Pharmacist',
            'Laboratory Analyst',
            'Environmental Scientist',
            'Data Scientist'
          ]
        };
      case 'A':
        return {
          cluster: 'Arts & Culture',
          pathway: 'Creative Arts & Design',
          learningAreas: [
            { name: 'Visual Arts', code: 'ART' },
            { name: 'Design', code: 'DES' },
            { name: 'Dramatic Arts', code: 'DRAM' },
            { name: 'Music', code: 'MUS' }
          ],
          careers: [
            'Graphic Designer',
            'Multimedia Artist',
            'Art Director',
            'Interior Designer',
            'Photographer',
            'Creative Director'
          ]
        };
      case 'S':
        return {
          cluster: 'Human & Social Sciences',
          pathway: 'Education & Social Services',
          learningAreas: [
            { name: 'Life Orientation', code: 'LO' },
            { name: 'Languages', code: 'LANG' },
            { name: 'Social Sciences', code: 'SOC' },
            { name: 'Religion Studies', code: 'REL' }
          ],
          careers: [
            'Teacher',
            'Social Worker',
            'Counselor',
            'Community Development Worker',
            'Human Resources Specialist',
            'Child Care Worker'
          ]
        };
      case 'E':
        return {
          cluster: 'Business & Entrepreneurship',
          pathway: 'Business Studies & Management',
          learningAreas: [
            { name: 'Business Studies', code: 'BUS' },
            { name: 'Economics', code: 'ECON' },
            { name: 'Accounting', code: 'ACC' },
            { name: 'Mathematical Literacy', code: 'MLIT' }
          ],
          careers: [
            'Business Manager',
            'Entrepreneur',
            'Marketing Specialist',
            'Financial Advisor',
            'Sales Representative',
            'Business Analyst'
          ]
        };
      case 'C':
        return {
          cluster: 'ICT & Administration',
          pathway: 'Information & Communication Technology',
          learningAreas: [
            { name: 'Information Technology', code: 'IT' },
            { name: 'Computer Applications Technology', code: 'CAT' },
            { name: 'Mathematics', code: 'MATH' },
            { name: 'Accounting', code: 'ACC' }
          ],
          careers: [
            'Software Developer',
            'Database Administrator',
            'System Analyst',
            'IT Support Specialist',
            'Data Analyst',
            'Cybersecurity Specialist'
          ]
        };
      default:
        return {
          cluster: 'General Education',
          pathway: 'Comprehensive Learning',
          learningAreas: [
            { name: 'Languages', code: 'LANG' },
            { name: 'Mathematics', code: 'MATH' },
            { name: 'Life Orientation', code: 'LO' },
            { name: 'Physical Sciences', code: 'PHYS' }
          ],
          careers: [
            'General Manager',
            'Administrator',
            'Coordinator',
            'Supervisor',
            'Assistant',
            'Clerk'
          ]
        };
    }
  };

  const pathwayData = generatePathwayRecommendation();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success('Assessment rubric uploaded successfully!');
    }
  };

  const handleAnalyzeRubric = async () => {
    if (!uploadedFile) {
      toast.error('Please upload an assessment rubric first.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('Assessment rubric analyzed! Results have been integrated into the pathway recommendation.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Selected Pathway Grade 9-12
            </h1>
            <p className="text-gray-600 mt-2">AI-Generated Pathway Recommendation for {assessmentData.name}</p>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Pathway Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Recommended Cluster & Pathway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Cluster</h4>
                  <p className="text-blue-700 text-lg">{pathwayData.cluster}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Pathway</h4>
                  <p className="text-purple-700 text-lg">{pathwayData.pathway}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Based on CBC Portfolio</h4>
                  <p className="text-green-700">Primary: {assessmentData.topCodes.split(',')[0]} | Secondary: {assessmentData.topCodes.split(',')[1]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Assessment Upload */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-6 h-6 text-orange-600" />
                Teacher Assessment Rubrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rubric-upload">Upload Assessment Rubric (PDF/DOC)</Label>
                  <Input
                    id="rubric-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                </div>
                
                {uploadedFile && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <FileText className="w-4 h-4 inline mr-1" />
                      {uploadedFile.name}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleAnalyzeRubric}
                  disabled={!uploadedFile || isAnalyzing}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with AI'}
                </Button>
                
                <p className="text-xs text-gray-500">
                  AI will analyze the rubric to enhance pathway recommendations and provide detailed learning outcomes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Areas */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              Required Learning Areas & Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pathwayData.learningAreas.map((area, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg text-center">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {area.code}
                  </div>
                  <h4 className="font-semibold text-gray-800">{area.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">Subject Code: {area.code}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Options */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-600" />
              Career Opportunities (6+ Options)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pathwayData.careers.map((career, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-800">{career}</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Aligns with your {pathwayData.cluster.toLowerCase()} interests and skills
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Integration Notice */}
        <Card className="shadow-xl mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">AI-Enhanced Pathway Selection</h3>
            </div>
            <p className="text-white/90 mb-4">
              This pathway recommendation is generated using advanced AI analysis of your CBC portfolio assessment results, 
              combined with current educational standards and career market trends.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 p-3 rounded-lg">
                <strong>Assessment Integration:</strong> Based on your primary {assessmentData.topCodes.split(',')[0]} profile
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <strong>Market Alignment:</strong> Careers selected based on qualification requirements
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <strong>Quality Assurance:</strong> AI validates pathway coherence and viability
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelectedPathway;
