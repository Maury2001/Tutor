
import React from 'react';
import { IntegratedAssessment } from '../../../components/qa_components/assessment/IntegratedAssessment';
import { Brain, Target, BookOpen, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const IntegratedAssessmentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>
          
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
              <Star className="w-4 h-4 mr-2" />
              AI POWERED ASSESSMENT
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
            CBE Pathway & Career Assessment
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Complete your comprehensive AI-driven assessment to discover your ideal CBE pathway and career personality profile
          </p>

          {/* Progress Indicator Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">CBE Learning Areas</h3>
              <p className="text-sm text-green-600 font-medium">Academic interests evaluation</p>
              <div className="mt-3 text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block">
                16 Questions
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">RIASEC Personality</h3>
              <p className="text-sm text-blue-600 font-medium">Career personality analysis</p>
              <div className="mt-3 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full inline-block">
                17 Questions
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-white" />
                  <Sparkles className="w-3 h-3 absolute -top-0.5 -right-0.5 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">AI Psychometric</h3>
              <p className="text-sm text-purple-600 font-medium">Cognitive abilities analysis</p>
              <div className="mt-3 text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-full inline-block">
                17 Questions
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Component */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <IntegratedAssessment />
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 max-w-lg mx-auto">
            <p className="text-gray-600 text-sm font-medium">
              AI-Powered Career Guidance • Comprehensive Assessment • CBE Pathway Recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedAssessmentPage;
