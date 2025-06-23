'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Upload, Download, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaterialManagementProps {
  onStatsUpdate: () => void;
}

export const MaterialManagement: React.FC<MaterialManagementProps> = ({ onStatsUpdate }) => {
  const [materials, setMaterials] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    content: '',
    material_type: '',
    category: '',
    grade_levels: [] as string[],
    is_published: false
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const { data } = await supabase
        .from('career_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setMaterials(data);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async () => {
    try {
      if (!newMaterial.title || !newMaterial.material_type) {
        toast({
          title: "Missing information",
          description: "Please fill in required fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('career_materials')
        .insert({
          ...newMaterial,
          created_by: null // No user authentication
        });

      if (error) throw error;

      toast({
        title: "Material added",
        description: "Career material has been successfully added",
      });

      setShowAddDialog(false);
      setNewMaterial({
        title: '',
        description: '',
        content: '',
        material_type: '',
        category: '',
        grade_levels: [],
        is_published: false
      });
      loadMaterials();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add material",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (materialId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('career_materials')
        .update({ is_published: !currentStatus })
        .eq('id', materialId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Material ${currentStatus ? 'unpublished' : 'published'} successfully`,
      });

      loadMaterials();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update material status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading materials...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Career Materials Management</CardTitle>
            <CardDescription>
              Upload and manage career guidance materials and resources
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Career Material</DialogTitle>
                  <DialogDescription>
                    Create a new career guidance resource
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                        placeholder="Enter material title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Material Type *</Label>
                      <Select value={newMaterial.material_type} onValueChange={(value) => setNewMaterial({ ...newMaterial, material_type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="career_guide">Career Guide</SelectItem>
                          <SelectItem value="learning_area">Learning Area Info</SelectItem>
                          <SelectItem value="pathway_info">Pathway Information</SelectItem>
                          <SelectItem value="resource">General Resource</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newMaterial.content}
                      onChange={(e) => setNewMaterial({ ...newMaterial, content: e.target.value })}
                      placeholder="Enter the main content"
                      rows={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newMaterial.category}
                        onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                        placeholder="e.g., STEM, Arts, Business"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Grades</Label>
                      <Select onValueChange={(value) => {
                        const grades = newMaterial.grade_levels;
                        if (!grades.includes(value)) {
                          setNewMaterial({ ...newMaterial, grade_levels: [...grades, value] });
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grades" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                            <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {newMaterial.grade_levels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {newMaterial.grade_levels.map(grade => (
                            <Badge key={grade} variant="secondary" className="text-xs">
                              Grade {grade}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMaterial}>
                    Add Material
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {materials.map((material: any) => (
            <div key={material.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{material.title}</h3>
                  <Badge variant="outline">{material.material_type}</Badge>
                  {material.category && (
                    <Badge variant="secondary">{material.category}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {material.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Created: {new Date(material.created_at).toLocaleDateString()}</span>
                  <span>Views: {material.views_count || 0}</span>
                  {material.grade_levels?.length > 0 && (
                    <span>Grades: {material.grade_levels.join(', ')}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={material.is_published ? 'default' : 'secondary'}>
                  {material.is_published ? 'Published' : 'Draft'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublishStatus(material.id, material.is_published)}
                >
                  {material.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
