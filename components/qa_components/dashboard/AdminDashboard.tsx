'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { School, Users, FileText, Settings, Key, Shield } from 'lucide-react';
import { SchoolManagement } from './admin/SchoolManagement';
import { UserManagement } from './admin/UserManagement';
import { MaterialManagement } from './admin/MaterialManagement';
import { PasswordManagement } from './admin/PasswordManagement';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalUsers: 0,
    totalMaterials: 0,
    activeSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [schoolsRes, usersRes, materialsRes] = await Promise.all([
        supabase.from('schools').select('*', { count: 'exact' }),
        supabase.from('app_users').select('*', { count: 'exact' }),
        supabase.from('career_materials').select('*', { count: 'exact' })
      ]);

      const activeSchools = await supabase
        .from('schools')
        .select('*', { count: 'exact' })
        .eq('subscription_status', 'active');

      setStats({
        totalSchools: schoolsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalMaterials: materialsRes.count || 0,
        activeSubscriptions: activeSchools.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Control Panel
            </h1>
            <p className="text-gray-600">CBC Assessment Platform - System Administration</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="text-lg px-4 py-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              System Administrator
            </Badge>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <School className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Schools</p>
                  <p className="text-2xl font-bold text-green-700">{stats.totalSchools}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Materials</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.totalMaterials}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-orange-700">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Management Tabs */}
        <Tabs defaultValue="schools" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="schools" className="flex items-center gap-2 text-sm">
              <School className="w-4 h-4" />
              Schools
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="passwords" className="flex items-center gap-2 text-sm">
              <Key className="w-4 h-4" />
              Passwords
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              Materials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schools">
            <SchoolManagement onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="passwords">
            <PasswordManagement onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialManagement onStatsUpdate={loadStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
