import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSpreadsheet, Check, X, BarChart3 } from 'lucide-react';

interface ConventionalSimulationProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const sampleData = [
  { id: 1, name: 'John Smith', department: 'Sales', salary: 75000, hireDate: '2022-01-15', performance: 'Excellent' },
  { id: 2, name: 'Sarah Johnson', department: 'Marketing', salary: 65000, hireDate: '2021-03-10', performance: 'Good' },
  { id: 3, name: 'Mike Chen', department: 'IT', salary: 85000, hireDate: '2020-07-22', performance: 'Excellent' },
  { id: 4, name: 'Emily Davis', department: 'HR', salary: 70000, hireDate: '2021-11-05', performance: 'Average' },
  { id: 5, name: 'David Wilson', department: 'Finance', salary: 80000, hireDate: '2019-04-18', performance: 'Good' },
  { id: 6, name: 'Lisa Brown', department: 'Sales', salary: 72000, hireDate: '2022-08-12', performance: 'Excellent' },
  { id: 7, name: 'Robert Taylor', department: 'IT', salary: 90000, hireDate: '2018-12-03', performance: 'Good' },
  { id: 8, name: 'Amanda Miller', department: 'Marketing', salary: 63000, hireDate: '2023-02-28', performance: 'Average' }
];

const tasks = [
  {
    title: 'Sort by Salary (Highest to Lowest)',
    description: 'Arrange the employee data by salary in descending order',
    solution: [...sampleData].sort((a, b) => b.salary - a.salary)
  },
  {
    title: 'Group by Department',
    description: 'Organize employees by their department',
    solution: sampleData.reduce((acc, employee) => {
      if (!acc[employee.department]) acc[employee.department] = [];
      acc[employee.department].push(employee);
      return acc;
    }, {} as Record<string, typeof sampleData>)
  },
  {
    title: 'Filter High Performers',
    description: 'Show only employees with "Excellent" performance ratings',
    solution: sampleData.filter(emp => emp.performance === 'Excellent')
  }
];

const ConventionalSimulation = ({ onComplete, onBack }: ConventionalSimulationProps) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [sortedData, setSortedData] = useState([...sampleData]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useState(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  });

  const checkAnswer = () => {
    const task = tasks[currentTask];
    let correct = false;

    if (currentTask === 0) {
      // Check if sorted by salary descending
      const expectedOrder = (task.solution as typeof sampleData).map(emp => emp.id);
      const actualOrder = sortedData.map(emp => emp.id);
      correct = JSON.stringify(expectedOrder) === JSON.stringify(actualOrder);
    } else if (currentTask === 1) {
      // For grouping task, just check if user understood the concept
      correct = true; // Simplified for demo
    } else if (currentTask === 2) {
      // Check if filtered to excellent performers only
      const excellentCount = sortedData.filter(emp => emp.performance === 'Excellent').length;
      const expectedCount = (task.solution as typeof sampleData).length;
      correct = excellentCount === expectedCount && sortedData.length === expectedCount;
    }

    setIsCorrect(correct);
    if (correct) {
      const taskScore = 100 / tasks.length;
      setScore(prev => prev + taskScore);
    }

    setTimeout(() => {
      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1);
        setIsCorrect(null);
        setSortedData([...sampleData]);
      } else {
        onComplete(Math.round(score + (correct ? 100 / tasks.length : 0)));
      }
    }, 1500);
  };

  const handleSort = (field: keyof typeof sampleData[0], descending = false) => {
    const sorted = [...sortedData].sort((a, b) => {
      if (typeof a[field] === 'string') {
        return descending 
          ? (b[field] as string).localeCompare(a[field] as string)
          : (a[field] as string).localeCompare(b[field] as string);
      }
      return descending 
        ? (a[field] as number) - (b[field] as number)
        : (a[field] as number) - (b[field] as number);
    });
    setSortedData(sorted);
  };

  const handleFilter = (field: keyof typeof sampleData[0], value: string) => {
    const filtered = sampleData.filter(emp => emp[field] === value);
    setSortedData(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
              Data Organization Challenge
            </h1>
            <p className="text-gray-600">Master data management and analysis skills</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-gray-600">{Math.round(score)}/100</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-gray-500" />
                Task {currentTask + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{tasks[currentTask].title}</h3>
                <p className="text-sm text-gray-600">{tasks[currentTask].description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Tools:</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    onClick={() => handleSort('salary', true)}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    Sort by Salary ↓
                  </Button>
                  <Button 
                    onClick={() => handleSort('name')}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    Sort by Name ↑
                  </Button>
                  <Button 
                    onClick={() => handleFilter('performance', 'Excellent')}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    Filter Excellent
                  </Button>
                  <Button 
                    onClick={() => setSortedData([...sampleData])}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    Reset Data
                  </Button>
                </div>
              </div>

              <Button
                onClick={checkAnswer}
                className="w-full bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700 text-white"
              >
                Check Answer
              </Button>

              {isCorrect !== null && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {isCorrect ? 'Correct! Well organized.' : 'Not quite right. Try again.'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-xl">
            <CardHeader>
              <CardTitle>Employee Database</CardTitle>
              <p className="text-gray-600">Showing {sortedData.length} employees</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Salary</th>
                      <th className="text-left p-2">Hire Date</th>
                      <th className="text-left p-2">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((employee, index) => (
                      <tr key={employee.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-2">{employee.name}</td>
                        <td className="p-2">{employee.department}</td>
                        <td className="p-2">${employee.salary.toLocaleString()}</td>
                        <td className="p-2">{employee.hireDate}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            employee.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                            employee.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {employee.performance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Conventional Careers:</h4>
                <div className="space-y-1 text-sm">
                  {[
                    'Data Analyst',
                    'Accountant',
                    'Administrator',
                    'Database Manager',
                    'Financial Analyst',
                    'Operations Manager'
                  ].map((career, index) => (
                    <div key={index} className="text-blue-700">• {career}</div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Skills Practiced:</h4>
                <div className="space-y-1 text-sm text-indigo-700">
                  <div>• Data organization</div>
                  <div>• Pattern recognition</div>
                  <div>• Systematic thinking</div>
                  <div>• Attention to detail</div>
                  <div>• Process optimization</div>
                  <div>• Quality control</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Statistics:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Records:</span>
                    <span className="font-medium">{sampleData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filtered View:</span>
                    <span className="font-medium">{sortedData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Elapsed:</span>
                    <span className="font-medium">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="font-medium">{currentTask + 1}/{tasks.length}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-2">📊</div>
                <p className="text-gray-600 text-sm">
                  Organizing information
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConventionalSimulation;
