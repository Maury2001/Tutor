'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Key, UserPlus, Search, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PasswordManagementProps {
  onStatsUpdate: () => void;
}

export const PasswordManagement: React.FC<PasswordManagementProps> = ({ onStatsUpdate }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await supabase
        .from('app_users')
        .select('id, username, email, full_name, user_type, is_active')
        .order('full_name');

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const updatePassword = async (userId: string, password: string) => {
    if (!password || password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const passwordHash = await hashPassword(password);
      
      const { error } = await supabase
        .from('app_users')
        .update({ password_hash: passwordHash })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "User password has been successfully updated",
      });

      setNewPassword('');
      setSelectedUser('');
      setEditingUser('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user: any) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Password Management
          </CardTitle>
          <CardDescription>
            Update user passwords and manage authentication credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Users */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Password Update */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
            <div>
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose user" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="flex gap-2">
                <Input
                  id="new-password"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                  size="sm"
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => updatePassword(selectedUser, newPassword)}
                disabled={!selectedUser || !newPassword || loading}
                className="w-full"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Click on a user to quickly update their password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{user.full_name}</h3>
                    <span className="text-sm text-gray-500">({user.username})</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.user_type === 'system_admin' ? 'bg-red-100 text-red-800' :
                      user.user_type === 'school_admin' ? 'bg-orange-100 text-orange-800' :
                      user.user_type === 'teacher' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.user_type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {editingUser === user.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="w-32"
                      />
                      <Button
                        size="sm"
                        onClick={() => updatePassword(user.id, newPassword)}
                        disabled={!newPassword || loading}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingUser('');
                          setNewPassword('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingUser(user.id);
                        setNewPassword('');
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Change Password
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
