'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SchoolManagementProps {
  onStatsUpdate: () => void;
}

export const SchoolManagement: React.FC<SchoolManagementProps> = ({ onStatsUpdate }) => {
  const [schools, setSchools] = useState([]);
  const [counties, setCounties] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newSchool, setNewSchool] = useState({
    name: '',
    registration_number: '',
    county_id: '',
    sub_county: '',
    ward: '',
    phone: '',
    email: '',
    principal_name: '',
    school_type: 'public'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [schoolsRes, countiesRes] = await Promise.all([
        supabase.from('schools').select(`
          *,
          counties(name)
        `).order('name'),
        supabase.from('counties').select('*').order('name')
      ]);

      if (schoolsRes.data) setSchools(schoolsRes.data);
      if (countiesRes.data) setCounties(countiesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchool = async () => {
    try {
      if (!newSchool.name || !newSchool.county_id) {
        toast({
          title: "Missing information",
          description: "Please fill in required fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('schools')
        .insert({
          ...newSchool,
          county_id: parseInt(newSchool.county_id)
        });

      if (error) throw error;

      toast({
        title: "School added",
        description: "School has been successfully added",
      });

      setShowAddDialog(false);
      setNewSchool({
        name: '',
        registration_number: '',
        county_id: '',
        sub_county: '',
        ward: '',
        phone: '',
        email: '',
        principal_name: '',
        school_type: 'public'
      });
      loadData();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add school",
        variant: "destructive",
      });
    }
  };

  const toggleSubscription = async (schoolId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('schools')
        .update({ 
          subscription_status: newStatus,
          subscription_start_date: newStatus === 'active' ? new Date().toISOString() : null,
          subscription_end_date: newStatus === 'active' ? 
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', schoolId);

      if (error) throw error;

      toast({
        title: "Subscription updated",
        description: `School subscription ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });

      loadData();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading schools...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>School Management</CardTitle>
            <CardDescription>
              Add, manage schools and control their subscriptions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import Schools
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add School
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New School</DialogTitle>
                  <DialogDescription>
                    Enter the school details below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">School Name *</Label>
                    <Input
                      id="name"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                      id="registration_number"
                      value={newSchool.registration_number}
                      onChange={(e) => setNewSchool({ ...newSchool, registration_number: e.target.value })}
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>County *</Label>
                    <Select value={newSchool.county_id} onValueChange={(value) => setNewSchool({ ...newSchool, county_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map((county: any) => (
                          <SelectItem key={county.id} value={county.id.toString()}>
                            {county.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sub_county">Sub County</Label>
                    <Input
                      id="sub_county"
                      value={newSchool.sub_county}
                      onChange={(e) => setNewSchool({ ...newSchool, sub_county: e.target.value })}
                      placeholder="Enter sub county"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward</Label>
                    <Input
                      id="ward"
                      value={newSchool.ward}
                      onChange={(e) => setNewSchool({ ...newSchool, ward: e.target.value })}
                      placeholder="Enter ward"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newSchool.phone}
                      onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newSchool.email}
                      onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principal_name">Principal Name</Label>
                    <Input
                      id="principal_name"
                      value={newSchool.principal_name}
                      onChange={(e) => setNewSchool({ ...newSchool, principal_name: e.target.value })}
                      placeholder="Enter principal name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>School Type</Label>
                    <Select value={newSchool.school_type} onValueChange={(value) => setNewSchool({ ...newSchool, school_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSchool}>
                    Add School
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schools.map((school: any) => (
            <div key={school.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{school.name}</h3>
                <p className="text-sm text-gray-600">
                  {school.counties?.name} • {school.registration_number}
                </p>
                <p className="text-sm text-gray-500">
                  {school.principal_name} • {school.phone}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  school.subscription_status === 'active' ? 'default' :
                  school.subscription_status === 'trial' ? 'secondary' : 'destructive'
                }>
                  {school.subscription_status}
                </Badge>
                <Button
                  variant={school.subscription_status === 'active' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => toggleSubscription(school.id, school.subscription_status)}
                >
                  {school.subscription_status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
