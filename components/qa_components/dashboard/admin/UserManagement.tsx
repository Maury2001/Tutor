'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Search, Upload, Download, Users, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  onStatsUpdate: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onStatsUpdate }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, activeTab]);

  const loadUsers = async () => {
    try {
      const { data } = await supabase
        .from('app_users')
        .select(`
          *,
          counties(name),
          schools(name)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by user type
    if (activeTab !== 'all') {
      filtered = filtered.filter((user: any) => user.user_type === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((user: any) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('app_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User status updated",
        description: `User ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });

      loadUsers();
      onStatsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const verifyUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('app_users')
        .update({ is_verified: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User verified",
        description: "User has been successfully verified",
      });

      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users, verify accounts, and control access
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import Users
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* User Type Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="student">Students</TabsTrigger>
              <TabsTrigger value="teacher">Teachers</TabsTrigger>
              <TabsTrigger value="parent">Parents</TabsTrigger>
              <TabsTrigger value="school_admin">School Admins</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{user.full_name}</h3>
                      <Badge variant="outline">
                        {user.user_type.replace('_', ' ')}
                      </Badge>
                      {user.grade_level && (
                        <Badge variant="secondary">Grade {user.grade_level}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {user.username} • {user.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.counties?.name} • {user.schools?.name || 'No school assigned'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Registered: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                    <Badge variant={user.is_active ? 'default' : 'destructive'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    {!user.is_verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => verifyUser(user.id)}
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    
                    <Button
                      variant={user.is_active ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                    >
                      {user.is_active ? (
                        <>
                          <UserX className="w-4 h-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
