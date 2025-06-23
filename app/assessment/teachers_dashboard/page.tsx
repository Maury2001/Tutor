
import React from 'react';
import { EnhancedTeacherDashboard } from '../../../components/qa_components/dashboard/EnhancedTeacherDashboard';

const TeacherDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <EnhancedTeacherDashboard />
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
