'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, Plus, FileText, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  full_name: string;
  grade_level: string;
}

interface TermlyMark {
  id?: string;
  student_id: string;
  subject_area: string;
  marks: number;
  grade: string;
  remarks: string;
}

const SUBJECT_AREAS = [
  'Mathematics',
  'English',
  'Kiswahili',
  'Science',
  'Social Studies',
  'Religious Education',
  'Creative Arts',
  'Physical Education'
];

const TERMS = [
  { value: 1, label: 'Term 1' },
  { value: 2, label: 'Term 2' },
  { value: 3, label: 'Term 3' }
];

export const TeacherMarksEntry = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [marks, setMarks] = useState<TermlyMark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentMarks();
    }
  }, [selectedStudent, selectedTerm, selectedYear]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('id, full_name, grade_level')
        .eq('user_type', 'student')
        .eq('is_active', true);

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    }
  };

  const fetchStudentMarks = async () => {
    if (!selectedStudent) return;

    try {
      const { data, error } = await supabase
        .from('termly_marks')
        .select('*')
        .eq('student_id', selectedStudent)
        .eq('term', selectedTerm)
        .eq('academic_year', selectedYear);

      if (error) throw error;

      const existingMarks = data || [];
      const allMarks = SUBJECT_AREAS.map(subject => {
        const existing = existingMarks.find(m => m.subject_area === subject);
        return existing || {
          student_id: selectedStudent,
          subject_area: subject,
          marks: 0,
          grade: '',
          remarks: ''
        };
      });

      setMarks(allMarks);
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const calculateGrade = (marks: number): string => {
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'E';
  };

  const updateMark = (index: number, field: keyof TermlyMark, value: string | number) => {
    const updatedMarks = [...marks];
    updatedMarks[index] = { ...updatedMarks[index], [field]: value };
    
    if (field === 'marks') {
      updatedMarks[index].grade = calculateGrade(Number(value));
    }
    
    setMarks(updatedMarks);
  };

  const saveMarks = async () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const marksToSave = marks.map(mark => ({
        ...mark,
        teacher_id: userData.user.id,
        term: selectedTerm,
        academic_year: selectedYear,
        marks: Number(mark.marks)
      }));

      const { error } = await supabase
        .from('termly_marks')
        .upsert(marksToSave, {
          onConflict: 'student_id,term,academic_year,subject_area'
        });

      if (error) throw error;

      // Calculate performance report
      await supabase.rpc('calculate_student_performance', {
        p_student_id: selectedStudent,
        p_term: selectedTerm,
        p_academic_year: selectedYear
      });

      toast({
        title: "Success",
        description: "Marks saved and performance report generated successfully",
      });

    } catch (error) {
      console.error('Error saving marks:', error);
      toast({
        title: "Error",
        description: "Failed to save marks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Termly Marks Entry
          </CardTitle>
          <CardDescription>
            Enter end-of-term marks for students and generate performance reports
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
                  {TERMS.map(term => (
                    <SelectItem key={term.value} value={term.value.toString()}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name} - {student.grade_level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Areas Assessment</CardTitle>
            <CardDescription>
              Enter marks for each learning area (0-100)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learning Area</TableHead>
                  <TableHead>Marks (/100)</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marks.map((mark, index) => (
                  <TableRow key={mark.subject_area}>
                    <TableCell className="font-medium">{mark.subject_area}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={mark.marks}
                        onChange={(e) => updateMark(index, 'marks', Number(e.target.value))}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={mark.grade === 'A' ? 'default' : mark.grade === 'E' ? 'destructive' : 'secondary'}>
                        {mark.grade || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={mark.remarks}
                        onChange={(e) => updateMark(index, 'remarks', e.target.value)}
                        placeholder="Optional remarks"
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-6">
              <Button onClick={saveMarks} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Marks & Generate Report'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
