
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface DocumentUploadProps {
  uploadedDocuments: File[];
  onDocumentsChange: (documents: File[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  isComplete: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  uploadedDocuments,
  onDocumentsChange,
  onNext,
  onPrevious,
  isComplete
}) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const updatedDocuments = [...uploadedDocuments, ...newFiles];
      onDocumentsChange(updatedDocuments);
      
      toast({
        title: "Documents uploaded successfully",
        description: `${newFiles.length} document(s) added to your assessment.`,
      });
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = uploadedDocuments.filter((_, i) => i !== index);
    onDocumentsChange(updatedDocuments);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-6 h-6 text-blue-600" />
              Upload Supporting Documents (Optional)
            </CardTitle>
            <CardDescription>
              Upload any school reports, certificates, or portfolios to enhance your career pathway recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Documents (PDF, Word, Images)
              </label>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, Word documents, JPEG, PNG images
              </p>
            </div>

            {uploadedDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Uploaded Documents:</h4>
                <div className="space-y-2">
                  {uploadedDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div>
                          <span className="font-medium text-sm">{file.name}</span>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {(file.size / 1024).toFixed(1)} KB
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {file.type.split('/')[1]?.toUpperCase() || 'File'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Document Types That Help:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Grade 7-9 school reports and transcripts</li>
                <li>Art portfolios or creative work samples</li>
                <li>Sports certificates and achievements</li>
                <li>Leadership roles and community service records</li>
                <li>Any special talents or skills documentation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Back to Questions
          </Button>
          
          <Button 
            onClick={onNext}
            disabled={!isComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete Assessment & Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};
