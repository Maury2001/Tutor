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
import { Plus, Upload, Check, X, FileText, Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrainingMaterial {
  id: string;
  title: string;
  description: string;
  content: string;
  material_type: string;
  subject_area: string;
  grade_level: string;
  keywords: string[];
  file_url: string;
  status: 'pending' | 'approved' | 'rejected' | 'training';
  uploaded_by: string;
  approved_by: string;
  created_at: string;
  updated_at: string;
}

const MATERIAL_TYPES = [
  'assessment_question',
  'career_guidance',
  'learning_content',
  'personality_data',
  'pathway_information',
  'performance_metrics'
];

const SUBJECT_AREAS = [
  'Mathematics',
  'English',
  'Kiswahili', 
  'Science',
  'Social Studies',
  'Career Guidance',
  'Personality Assessment',
  'General'
];

const GRADE_LEVELS = [
  'Grade 7',
  'Grade 8', 
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'All Grades'
];

export const AITrainingMaterials = () => {
  const [materials, setMaterials] = useState<TrainingMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<TrainingMaterial | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    material_type: '',
    subject_area: '',
    grade_level: '',
    keywords: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_training_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials((data || []) as TrainingMaterial[]);
    } catch (error) {
      console.error('Error fetching training materials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch training materials",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.material_type) {
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

      const keywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);

      const materialData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        material_type: formData.material_type,
        subject_area: formData.subject_area,
        grade_level: formData.grade_level,
        keywords,
        uploaded_by: userData.user.id
      };

      if (editingMaterial) {
        const { error } = await supabase
          .from('ai_training_materials')
          .update(materialData)
          .eq('id', editingMaterial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ai_training_materials')
          .insert([materialData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Training material ${editingMaterial ? 'updated' : 'uploaded'} successfully`,
      });

      resetForm();
      fetchMaterials();

    } catch (error) {
      console.error('Error saving training material:', error);
      toast({
        title: "Error",
        description: "Failed to save training material",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      material_type: '',
      subject_area: '',
      grade_level: '',
      keywords: ''
    });
    setEditingMaterial(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (material: TrainingMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      content: material.content,
      material_type: material.material_type,
      subject_area: material.subject_area || '',
      grade_level: material.grade_level || '',
      keywords: material.keywords?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const updateMaterialStatus = async (materialId: string, newStatus: string, isApproval = false) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const updateData: any = { status: newStatus };
      if (isApproval) {
        updateData.approved_by = userData.user.id;
      }

      const { error } = await supabase
        .from('ai_training_materials')
        .update(updateData)
        .eq('id', materialId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Material ${newStatus} successfully`,
      });

      fetchMaterials();
    } catch (error) {
      console.error('Error updating material status:', error);
      toast({
        title: "Error",
        description: "Failed to update material status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      training: 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600',
      approved: 'text-green-600',
      rejected: 'text-red-600',
      training: 'text-blue-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const materialStats = materials.reduce((acc, material) => {
    acc[material.status] = (acc[material.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{materialStats.approved || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{materialStats.pending || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <X className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{materialStats.rejected || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Materials Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AI Training Materials Management
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingMaterial ? 'Edit Training Material' : 'Add New Training Material'}
                  </DialogTitle>
                  <DialogDescription>
                    Upload training materials to improve AI model performance
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter material title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the training material"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Material Type *</label>
                      <Select 
                        value={formData.material_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, material_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {MATERIAL_TYPES.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject Area</label>
                      <Select 
                        value={formData.subject_area} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subject_area: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_AREAS.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Grade Level</label>
                      <Select 
                        value={formData.grade_level} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, grade_level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADE_LEVELS.map(grade => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Keywords</label>
                      <Input
                        value={formData.keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                        placeholder="comma, separated, keywords"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content *</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter the training material content"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : editingMaterial ? 'Update Material' : 'Add Material'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage AI training materials and approve content for model training
          </CardDescription>
        </CardHeader>
        <CardContent>
          {materials.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="max-w-xs">
                      <div className="truncate font-medium" title={material.title}>
                        {material.title}
                      </div>
                      {material.description && (
                        <div className="text-sm text-gray-500 truncate" title={material.description}>
                          {material.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {material.material_type.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{material.subject_area || 'N/A'}</TableCell>
                    <TableCell>{material.grade_level || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(material.status)}>
                        {material.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(material.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(material)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {material.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateMaterialStatus(material.id, 'approved', true)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateMaterialStatus(material.id, 'rejected', true)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No training materials found</p>
              <p className="text-sm">Upload materials to train AI models</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
