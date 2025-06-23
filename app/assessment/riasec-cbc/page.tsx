
import React from 'react';
import { Button } from '@/components/ui/button';
import { RiasecCbcAssessment } from '../../../components/qa_components/riasec/RiasecCbcAssessment';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const RiasecCbcAssessmentPage = () => {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate.push('/assessment')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        
        <RiasecCbcAssessment />
      </div>
    </div>
  );
};

export default RiasecCbcAssessmentPage;
