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
import { Plus, Edit, Trash2, Settings, Play, RotateCcw, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface AIConfigTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  config_data: Json;
  usage_stats: Json;
  is_system_template: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const TEMPLATE_CATEGORIES = [
  'assessment',
  'personality',
  'career_guidance', 
  'performance',
  'general'
];

const TEMPLATE_ICONS = [
  'settings',
  'brain',
  'target',
  'users',
  'book',
  'chart',
  'lightbulb'
];

const TEMPLATE_COLORS = [
  'blue',
  'green',
  'purple',
  'orange',
  'red',
  'pink',
  'indigo'
];

export const AIConfigTemplates = () => {
  const [templates, setTemplates] = useState<AIConfigTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AIConfigTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    icon: 'settings',
    color: 'blue',
    config_data: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_config_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as AIConfigTemplate[]);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI config templates",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
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

      let configData: Json = {};
      if (formData.config_data) {
        try {
          configData = JSON.parse(formData.config_data);
        } catch {
          throw new Error('Invalid JSON in configuration data');
        }
      }

      const templateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        color: formData.color,
        config_data: configData,
        created_by: userData.user.id
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('ai_config_templates')
          .update({ ...templateData, updated_by: userData.user.id })
          .eq('id', editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ai_config_templates')
          .insert([templateData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Template ${editingTemplate ? 'updated' : 'created'} successfully`,
      });

      resetForm();
      fetchTemplates();

    } catch (error: any) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save template",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      icon: 'settings',
      color: 'blue',
      config_data: ''
    });
    setEditingTemplate(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (template: AIConfigTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      category: template.category,
      icon: template.icon,
      color: template.color,
      config_data: JSON.stringify(template.config_data, null, 2)
    });
    setIsDialogOpen(true);
  };

  const applyTemplate = async (templateId: number) => {
    try {
      const { data, error } = await supabase.rpc('apply_ai_config_template', {
        template_id_param: templateId,
        applied_by_param: (await supabase.auth.getUser()).data.user?.id,
        reason_param: 'Applied from dashboard'
      });

      if (error) throw error;

      const response = data as any;
      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          toast({
            title: "Success",
            description: response.message || "Template applied successfully",
          });
        } else {
          throw new Error(response.error || "Failed to apply template");
        }
      } else {
        throw new Error("Unexpected response format");
      }

      fetchTemplates();
    } catch (error: any) {
      console.error('Error applying template:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to apply template",
        variant: "destructive"
      });
    }
  };

  const deleteTemplate = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('ai_config_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template deleted successfully",
      });

      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const getIconColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      pink: 'text-pink-600',
      indigo: 'text-indigo-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  // Helper function to safely extract usage stats
  const getUsageStats = (stats: Json) => {
    if (stats && typeof stats === 'object' && !Array.isArray(stats)) {
      const statsObj = stats as Record<string, any>;
      return {
        applied_count: statsObj.applied_count || 0,
        last_applied: statsObj.last_applied || null
      };
    }
    return { applied_count: 0, last_applied: null };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AI Configuration Templates
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTemplate ? 'Edit Template' : 'Create AI Config Template'}
                  </DialogTitle>
                  <DialogDescription>
                    Create reusable AI configuration templates for different use cases
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Template Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter template name"
                        required
                      />
                    </div>
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
                          {TEMPLATE_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this template does"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Icon</label>
                      <Select 
                        value={formData.icon} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEMPLATE_ICONS.map(icon => (
                            <SelectItem key={icon} value={icon}>
                              {icon.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <Select 
                        value={formData.color} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEMPLATE_COLORS.map(color => (
                            <SelectItem key={color} value={color}>
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Configuration Data (JSON)</label>
                    <Textarea
                      value={formData.config_data}
                      onChange={(e) => setFormData(prev => ({ ...prev, config_data: e.target.value }))}
                      placeholder='{"key": "value", "setting": "option"}'
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter configuration as valid JSON object
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage reusable AI configuration templates for different scenarios
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const usageStats = getUsageStats(template.usage_stats);
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${template.color}-100`}>
                      <Settings className={`w-5 h-5 ${getIconColor(template.color)}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {template.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  {template.is_system_template && (
                    <Badge variant="secondary" className="text-xs">
                      System
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description || 'No description provided'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Applied: {usageStats.applied_count} times</span>
                  <span>
                    {usageStats.last_applied 
                      ? new Date(usageStats.last_applied).toLocaleDateString()
                      : 'Never used'
                    }
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => applyTemplate(template.id)}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!template.is_system_template && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">No AI configuration templates found</p>
            <p className="text-sm text-gray-400">Create templates to quickly apply AI configurations</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
