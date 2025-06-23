'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Award, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  full_name: string;
  grade_level: string;
}

interface PerformanceReport {
  id: string;
  student_id: string;
  student_name?: string;
  term: number;
  academic_year: string;
  overall_average: number;
  grade: string;
  position: number;
  total_students: number;
  strengths: string[];
  areas_for_improvement: string[];
  generated_at: string;
}

interface SubjectPerformance {
  subject: string;
  average: number;
  grade: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const StudentPerformanceReports = () => {
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchReports();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [selectedTerm, selectedYear, selectedStudent]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('id, full_name, grade_level')
        .eq('user_type', 'student')
        .eq('is_active', true);

      if (error) throw error;
      setStudents(data as Student[] || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('student_performance_reports')
        .select('*')
        .eq('term', selectedTerm)
        .eq('academic_year', selectedYear);

      if (selectedStudent !== 'all') {
        query = query.eq('student_id', selectedStudent);
      }

      const { data, error } = await query.order('position', { ascending: true });

      if (error) throw error;
      
      // Add student names to reports
      const reportsWithNames = (data || []).map(report => {
        const student = students.find(s => s.id === report.student_id);
        return {
          ...report,
          student_name: student?.full_name || 'Unknown Student'
        };
      });
      
      setReports(reportsWithNames);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch performance reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const gradeDistribution = reports.reduce((acc: Record<string, number>, report) => {
    acc[report.grade] = (acc[report.grade] || 0) + 1;
    return acc;
  }, {});

  const gradeChartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: ((count / reports.length) * 100).toFixed(1)
  }));

  const performanceTrend = reports.map(report => ({
    student: report.student_name?.split(' ')[0] || 'Student',
    average: report.overall_average,
    position: report.position
  }));

  const exportReports = () => {
    const csvContent = [
      ['Student Name', 'Term', 'Academic Year', 'Average', 'Grade', 'Position', 'Total Students'],
      ...reports.map(report => [
        report.student_name || '',
        report.term.toString(),
        report.academic_year,
        report.overall_average?.toString() || '',
        report.grade,
        report.position?.toString() || '',
        report.total_students?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance_reports_${selectedYear}_term${selectedTerm}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Analysis & Reports
          </CardTitle>
          <CardDescription>
            Comprehensive student performance analytics and reporting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Academic Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Term</label>
              <Select value={selectedTerm.toString()} onValueChange={(value) => setSelectedTerm(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={exportReports} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      {reports.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold">{reports.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Class Average</p>
                    <p className="text-2xl font-bold">
                      {(reports.reduce((sum, r) => sum + (r.overall_average || 0), 0) / reports.length).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Performer</p>
                    <p className="text-2xl font-bold">
                      {reports.find(r => r.position === 1)?.student_name?.split(' ')[0] || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pass Rate (≥50%)</p>
                    <p className="text-2xl font-bold">
                      {Math.round((reports.filter(r => (r.overall_average || 0) >= 50).length / reports.length) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                    >
                      {gradeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceTrend.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="student" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="#8884d8" name="Average %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Detailed Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Reports</CardTitle>
          <CardDescription>
            Individual student performance breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Average</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Strengths</TableHead>
                  <TableHead>Improvements</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Badge variant={report.position <= 3 ? "default" : "secondary"}>
                        {report.position}/{report.total_students}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{report.student_name}</TableCell>
                    <TableCell>{report.overall_average?.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant={report.grade === 'A' ? 'default' : report.grade === 'E' ? 'destructive' : 'secondary'}>
                        {report.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {report.strengths?.slice(0, 2).map((strength, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                        {(report.strengths?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(report.strengths?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {report.areas_for_improvement?.slice(0, 2).map((area, i) => (
                          <Badge key={i} variant="destructive" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {(report.areas_for_improvement?.length || 0) > 2 && (
                          <Badge variant="destructive" className="text-xs">
                            +{(report.areas_for_improvement?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No performance reports found</p>
              <p className="text-sm">Enter student marks to generate reports</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
