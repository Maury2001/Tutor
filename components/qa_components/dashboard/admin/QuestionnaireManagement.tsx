'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, BookOpen, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  category: string;
  subcategory: string;
  difficulty_level: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const QUESTION_TYPES = [
  'multiple_choice',
  'true_false',
  'rating_scale',
  'likert_scale',
  'text_input',
  'checkbox'
];

const CATEGORIES = [
  'RIASEC Assessment',
  'CBC Learning Areas',
  'Career Interests',
  'Personality Traits',
  'Learning Preferences',
  'Skills Assessment'
];

const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5];

export const QuestionnaireManagement = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: '',
    options: '',
    category: '',
    subcategory: '',
    difficulty_level: 1
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questionnaire_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question_text || !formData.question_type || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      let options = null;
      if (formData.options) {
        try {
          options = JSON.parse(formData.options);
        } catch {
          // If not valid JSON, treat as comma-separated values
          options = formData.options.split(',').map(opt => opt.trim());
        }
      }

      const questionData = {
        ...formData,
        options,
        created_by: userData.user.id
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from('questionnaire_questions')
          .update(questionData)
          .eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('questionnaire_questions')
          .insert([questionData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Question ${editingQuestion ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchQuestions();

    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question_text: '',
      question_type: '',
      options: '',
      category: '',
      subcategory: '',
      difficulty_level: 1
    });
    setEditingQuestion(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options ? JSON.stringify(question.options, null, 2) : '',
      category: question.category,
      subcategory: question.subcategory || '',
      difficulty_level: question.difficulty_level
    });
    setIsDialogOpen(true);
  };

  const toggleQuestionStatus = async (questionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('questionnaire_questions')
        .update({ is_active: !currentStatus })
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Question ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      fetchQuestions();
    } catch (error) {
      console.error('Error updating question status:', error);
      toast({
        title: "Error",
        description: "Failed to update question status",
        variant: "destructive"
      });
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('questionnaire_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });

      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  const categoryStats = questions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeQuestions = questions.filter(q => q.is_active).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ToggleRight className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Questions</p>
                <p className="text-2xl font-bold">{activeQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{Object.keys(categoryStats).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ToggleLeft className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold">{questions.length - activeQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Questionnaire Questions Management
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </DialogTitle>
                  <DialogDescription>
                    Create or modify questions for assessments and questionnaires
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Text *</label>
                    <Textarea
                      value={formData.question_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
                      placeholder="Enter the question text"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Question Type *</label>
                      <Select 
                        value={formData.question_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, question_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_TYPES.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                      <Select 
                        value={formData.difficulty_level.toString()} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: Number(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIFFICULTY_LEVELS.map(level => (
                            <SelectItem key={level} value={level.toString()}>
                              Level {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subcategory</label>
                      <Input
                        value={formData.subcategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                        placeholder="Optional subcategory"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    <Textarea
                      value={formData.options}
                      onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                      placeholder="JSON array or comma-separated values for multiple choice questions"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For multiple choice: ["Option 1", "Option 2", "Option 3"] or Option 1, Option 2, Option 3
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage questions for assessments, RIASEC tests, and career guidance questionnaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={question.question_text}>
                        {question.question_text}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {question.question_type.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.category}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        Level {question.difficulty_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={question.is_active ? "default" : "secondary"}>
                        {question.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(question.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(question)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleQuestionStatus(question.id, question.is_active)}
                        >
                          {question.is_active ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No questions found</p>
              <p className="text-sm">Add questions to build your questionnaires</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
