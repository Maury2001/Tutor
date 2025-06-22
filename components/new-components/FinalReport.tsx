
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AssessmentData } from '@/pages/Index';
import { ArrowLeft, Download, FileText, Trophy, Star, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

interface SimulationResult {
  type: string;
  score: number;
  completed: boolean;
  skipped: boolean;
}

interface FinalReportProps {
  assessmentData: AssessmentData;
  simulationResults: Record<string, SimulationResult>;
  onBackToHub: () => void;
  onBackToResults: () => void;
}

const simulationNames = {
  R: 'CBC Practical Activities',
  I: 'Scientific Investigation', 
  A: 'Creative Arts Studio',
  S: 'Community Helper',
  E: 'Young Entrepreneur',
  C: 'Data Organization'
};

const generatePDFReport = (assessmentData: AssessmentData, simulationResults: Record<string, SimulationResult>) => {
  const reportContent = `
CBE PATHWAY & CAREER ASSESSMENT REPORT
======================================

Student Information:
- Name: ${assessmentData.name || 'Not provided'}
- Date: ${new Date().toLocaleDateString()}

CBC Portfolio Assessment Results:
- Primary Interest: ${assessmentData.topCodes.split(',')[0]}
- Secondary Interest: ${assessmentData.topCodes.split(',')[1]}

Detailed Scores:
${Object.entries(assessmentData.scores)
  .map(([code, score]) => `- ${code}: ${score}/25`)
  .join('\n')}

CBC Simulation Results:
${Object.entries(simulationResults)
  .map(([code, result]) => {
    const name = simulationNames[code as keyof typeof simulationNames];
    const status = result.completed ? `Completed (${result.score}%)` : 'Skipped';
    return `- ${name}: ${status}`;
  })
  .join('\n')}

Summary:
- Simulations Completed: ${Object.values(simulationResults).filter(r => r.completed).length}/6
- Simulations Skipped: ${Object.values(simulationResults).filter(r => r.skipped).length}/6
- Average Score: ${Math.round(Object.values(simulationResults).filter(r => r.completed).reduce((acc, r) => acc + r.score, 0) / Object.values(simulationResults).filter(r => r.completed).length || 0)}%

Recommended Next Steps:
Based on your competency based curriculum portfolio profile and CBC simulation performance, consider exploring career pathways that align with your strongest interests and demonstrated skills.
  `;

  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CBE_Pathway_Career_Report_${(assessmentData.name || 'Student').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const FinalReport = ({ assessmentData, simulationResults, onBackToHub, onBackToResults }: FinalReportProps) => {
  const completedResults = Object.values(simulationResults).filter(r => r.completed);
  const skippedResults = Object.values(simulationResults).filter(r => r.skipped);
  const averageScore = completedResults.length > 0 
    ? Math.round(completedResults.reduce((acc, r) => acc + r.score, 0) / completedResults.length)
    : 0;

  const [primaryCode, secondaryCode] = assessmentData.topCodes.split(',');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBackToHub} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Final Assessment Report
            </h1>
            <p className="text-gray-600 mt-2">CBE Pathway & Career Assessment Summary</p>
          </div>
          
          <Button
            onClick={() => generatePDFReport(assessmentData, simulationResults)}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-blue-600">{completedResults.length}</p>
              <p className="text-sm text-gray-600">out of 6 simulations</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Skipped</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-orange-600">{skippedResults.length}</p>
              <p className="text-sm text-gray-600">simulations</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Average Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-green-600">{averageScore}%</p>
              <p className="text-sm text-gray-600">completed simulations</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Top Interest</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-purple-600">{primaryCode}</p>
              <p className="text-sm text-gray-600">CBC type</p>
            </CardContent>
          </Card>
        </div>

        {/* CBC Portfolio Summary */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-center">Your CBC Portfolio Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg">
                <strong>Primary Interest:</strong> {primaryCode} | <strong>Secondary Interest:</strong> {secondaryCode}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(assessmentData.scores).map(([code, score]) => (
                <div key={code} className="text-center">
                  <h4 className="font-semibold text-lg">{code}</h4>
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                  <Progress value={(score / 25) * 100} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle>CBC Simulation Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(simulationResults).map(([code, result]) => {
                const name = simulationNames[code as keyof typeof simulationNames];
                return (
                  <div key={code} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {result.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-orange-600" />
                      )}
                      <div>
                        <h4 className="font-semibold">{name}</h4>
                        <p className="text-sm text-gray-600">
                          {result.completed ? 'Completed' : 'Skipped'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {result.completed ? (
                        <div>
                          <p className="text-2xl font-bold text-green-600">{result.score}%</p>
                          <Progress value={result.score} className="w-24 mt-1" />
                        </div>
                      ) : (
                        <p className="text-gray-500">Not attempted</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Based on Your CBC Portfolio Profile:</h4>
                <p className="text-blue-700">
                  Your primary interest is <strong>{primaryCode}</strong> and secondary is <strong>{secondaryCode}</strong>. 
                  Consider exploring career pathways that combine these interests.
                </p>
              </div>
              
              {completedResults.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Simulation Strengths:</h4>
                  <p className="text-green-700">
                    You performed well in {completedResults.length} simulation{completedResults.length !== 1 ? 's' : ''} 
                    with an average score of {averageScore}%. This shows good aptitude in these CBC learning areas.
                  </p>
                </div>
              )}

              {skippedResults.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Areas to Explore:</h4>
                  <p className="text-orange-700">
                    You skipped {skippedResults.length} simulation{skippedResults.length !== 1 ? 's' : ''}. 
                    Consider revisiting these areas when you're ready - they might reveal hidden interests!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Button
            onClick={() => generatePDFReport(assessmentData, simulationResults)}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Full Report
          </Button>
          
          <Button
            onClick={onBackToResults}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;
