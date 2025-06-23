'use client'
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Brain, BookOpen, Target, Clock, CheckCircle, GraduationCap, Users, TrendingUp, Award, Star, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const Index = () => {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <GraduationCap className="w-20 h-20 mx-auto text-blue-600 mb-4" />
              <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-yellow-500 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            CBE Pathway and Career Personality Assessment Platform
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-lg font-semibold">
              <Brain className="w-4 h-4 mr-2" />
              AI Powered
            </Badge>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Comprehensive AI-driven career guidance system for Kenyan students using Competency-Based Education framework with advanced personality profiling
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
              <p className="text-gray-600 font-medium">Students Assessed</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600 font-medium">AI Accuracy Rate</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">50+</h3>
              <p className="text-gray-600 font-medium">Career Pathways</p>
            </div>
          </div>
        </div>

        {/* Main Assessment Card */}
        <Card className="mb-16 max-w-5xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Brain className="w-10 h-10" />
                </div>
                <CardTitle className="text-3xl font-bold">
                  AI-Powered Career & Personality Assessment
                </CardTitle>
              </div>
              <Badge className="bg-yellow-500 text-yellow-900 font-semibold px-6 py-2 text-base shadow-lg">
                <Star className="w-4 h-4 mr-2" />
                AI RECOMMENDED
              </Badge>
              <CardDescription className="text-blue-50 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
                Complete 50-question AI-driven assessment combining RIASEC personality profiling, CBE Learning Areas evaluation, 
                and advanced Psychometric analysis for comprehensive CBE pathway guidance
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-10">
            {/* Assessment Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-green-800 mb-3">CBE Learning Areas</h4>
                <p className="text-green-700 font-medium mb-2">16 Questions</p>
                <p className="text-sm text-green-600 leading-relaxed">Academic interests and subject preferences evaluation based on Competency-Based Education</p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-blue-800 mb-3">RIASEC Personality Types</h4>
                <p className="text-blue-700 font-medium mb-2">17 Questions</p>
                <p className="text-sm text-blue-600 leading-relaxed">Career personality assessment and work environment preferences analysis</p>
              </div>
              
              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative">
                  <Brain className="w-8 h-8 text-white" />
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
                </div>
                <h4 className="text-xl font-bold text-purple-800 mb-3">AI Psychometric Profile</h4>
                <p className="text-purple-700 font-medium mb-2">17 Questions</p>
                <p className="text-sm text-purple-600 leading-relaxed">Advanced AI-powered cognitive abilities and personality traits analysis</p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl mb-8 border-2 border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <h3 className="text-2xl font-bold mb-6 text-blue-800 text-center flex items-center justify-center gap-2">
                <Brain className="w-6 h-6" />
                AI-Powered Assessment Results Include:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="flex items-center gap-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-white/50 hover:bg-white/90 transition-all">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-800">CBE Pathway Recommendations (Grade 10-12)</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-white/50 hover:bg-white/90 transition-all">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-800">AI-Powered Career Personality Analysis</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-white/50 hover:bg-white/90 transition-all">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-800">AI Career Consultant Access</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/70 rounded-lg backdrop-blur-sm border border-white/50 hover:bg-white/90 transition-all">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-800">Detailed AI Assessment Report</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <Button 
                onClick={() => navigate.push('/assessment/integrated')}
                size="lg"
                className="px-16 py-6 text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Target className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Start Your AI Assessment Journey</span>
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">60 minutes • 50 questions • AI-powered comprehensive results</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 max-w-2xl mx-auto">
            <p className="text-gray-700 font-medium">© 2025 CBE Pathway and Career Personality Assessment Platform</p>
            <p className="text-gray-600">AI-Powered Career Guidance for Kenyan Students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
