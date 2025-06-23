
import React from 'react';
import { AdminFullDashboard } from '../../../components/qa_components/dashboard/admin/AdminFullDashboard';


const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <AdminFullDashboard />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
