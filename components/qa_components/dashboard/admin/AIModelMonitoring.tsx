'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIModel {
  id: string;
  model_name: string;
  model_version: string;
  performance_metrics: any;
  accuracy_score: number;
  training_data_count: number;
  last_trained_at: string;
  status: 'active' | 'training' | 'deprecated';
  created_at: string;
  updated_at: string;
}

interface UsageMetric {
  date: string;
  requests: number;
  success_rate: number;
  avg_response_time: number;
}

export const AIModelMonitoring = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAIModels();
    fetchUsageMetrics();
  }, []);

  const fetchAIModels = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_model_monitoring')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels((data || []) as AIModel[]);
    } catch (error) {
      console.error('Error fetching AI models:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI model data",
        variant: "destructive"
      });
    }
  };

  const fetchUsageMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('created_at, success, response_time_ms')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data into daily metrics
      const dailyMetrics: Record<string, { requests: number; successes: number; total_response_time: number }> = {};
      
      (data || []).forEach(log => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!dailyMetrics[date]) {
          dailyMetrics[date] = { requests: 0, successes: 0, total_response_time: 0 };
        }
        dailyMetrics[date].requests++;
        if (log.success) dailyMetrics[date].successes++;
        dailyMetrics[date].total_response_time += log.response_time_ms || 0;
      });

      const metrics = Object.entries(dailyMetrics).map(([date, data]) => ({
        date,
        requests: data.requests,
        success_rate: data.requests > 0 ? (data.successes / data.requests) * 100 : 0,
        avg_response_time: data.requests > 0 ? data.total_response_time / data.requests : 0
      }));

      setUsageMetrics(metrics);
    } catch (error) {
      console.error('Error fetching usage metrics:', error);
    }
  };

  const refreshMonitoring = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchAIModels(), fetchUsageMetrics()]);
      toast({
        title: "Success",
        description: "Monitoring data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh monitoring data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'training':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'deprecated':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: 'default',
      training: 'secondary',
      deprecated: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const totalRequests = usageMetrics.reduce((sum, metric) => sum + metric.requests, 0);
  const avgSuccessRate = usageMetrics.length > 0 
    ? usageMetrics.reduce((sum, metric) => sum + metric.success_rate, 0) / usageMetrics.length 
    : 0;
  const avgResponseTime = usageMetrics.length > 0
    ? usageMetrics.reduce((sum, metric) => sum + metric.avg_response_time, 0) / usageMetrics.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold">{models.filter(m => m.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Success Rate</CardTitle>
            <CardDescription>Success rate over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="success_rate" stroke="#8884d8" strokeWidth={2} name="Success Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Request Volume</CardTitle>
            <CardDescription>API requests over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#82ca9d" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Models Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AI Model Performance Monitoring
            <Button onClick={refreshMonitoring} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </CardTitle>
          <CardDescription>
            Monitor AI model performance, accuracy, and training status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {models.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Training Data</TableHead>
                  <TableHead>Last Trained</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.model_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{model.model_version || 'v1.0'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(model.status)}
                        <Badge variant={getStatusBadge(model.status)}>
                          {model.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{(model.accuracy_score * 100).toFixed(1)}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${model.accuracy_score * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{model.training_data_count?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      {model.last_trained_at 
                        ? new Date(model.last_trained_at).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      {model.performance_metrics ? (
                        <Badge variant="secondary">
                          {Object.keys(model.performance_metrics).length} metrics
                        </Badge>
                      ) : (
                        <span className="text-gray-500">No data</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No AI models found</p>
              <p className="text-sm">AI models will appear here once they are deployed</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
