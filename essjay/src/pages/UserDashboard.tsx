import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { FormData } from '../types';
import { db } from '../services/database';
import { FileText, Plus, Download, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';

export function UserDashboard() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userType !== 'user' || !user) {
      navigate('/');
      return;
    }
    loadUserForms();
  }, [user, userType, navigate]);

  const loadUserForms = async () => {
    if (!user) return;
    
    try {
      const userForms = await db.getFormsByUserId(user.id);
      setForms(userForms);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: FormData['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 're-submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'under process':
        return 'bg-purple-100 text-purple-800';
      case 'action needed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: FormData['status']) => {
    switch (status) {
      case 'action needed':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const generatePDF = (form: FormData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.text('Service Request Form', pageWidth / 2, 20, { align: 'center' });
    
    // Form ID and Date
    doc.setFontSize(12);
    doc.text(`Form ID: ${form.id}`, 20, 40);
    doc.text(`Submission Date: ${new Date(form.submissionTime).toLocaleDateString()}`, 20, 50);
    doc.text(`Status: ${form.status.toUpperCase()}`, 20, 60);
    
    // Personal Information
    doc.setFontSize(14);
    doc.text('Personal Information', 20, 80);
    doc.setFontSize(12);
    doc.text(`Name: ${form.personalInfo.fullName}`, 20, 95);
    doc.text(`Email: ${form.personalInfo.email}`, 20, 105);
    doc.text(`Phone: ${form.personalInfo.phone}`, 20, 115);
    doc.text(`Address: ${form.personalInfo.address}`, 20, 125);
    
    if (form.personalInfo.dateOfBirth) {
      doc.text(`Date of Birth: ${form.personalInfo.dateOfBirth}`, 20, 135);
    }
    if (form.personalInfo.idNumber) {
      doc.text(`ID Number: ${form.personalInfo.idNumber}`, 20, 145);
    }
    
    // Service Details
    doc.setFontSize(14);
    doc.text('Service Details', 20, 165);
    doc.setFontSize(12);
    doc.text(`Service Type: ${form.serviceDetails.serviceType}`, 20, 180);
    doc.text(`Urgency: ${form.serviceDetails.urgency.toUpperCase()}`, 20, 190);
    
    // Description with text wrapping
    const description = form.serviceDetails.description;
    const splitDescription = doc.splitTextToSize(description, pageWidth - 40);
    doc.text('Description:', 20, 200);
    doc.text(splitDescription, 20, 210);
    
    // Comments
    if (form.comments) {
      const commentsY = 210 + (splitDescription.length * 10) + 20;
      doc.setFontSize(14);
      doc.text('Comments', 20, commentsY);
      doc.setFontSize(12);
      const splitComments = doc.splitTextToSize(form.comments, pageWidth - 40);
      doc.text(splitComments, 20, commentsY + 15);
    }
    
    // Save the PDF
    doc.save(`Form_${form.id}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName || user?.username}!
          </h1>
          <p className="text-gray-600">
            Manage your service requests and track their progress
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/create-form')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Create New Form</span>
            </button>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Form Submissions</h2>
          </div>
          
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms submitted yet</h3>
              <p className="text-gray-600 mb-6">Create your first form to get started</p>
              <button
                onClick={() => navigate('/create-form')}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Create New Form</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <div>
                            <div>{new Date(form.submissionTime).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(form.submissionTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                          {getStatusIcon(form.status)}
                          <span>{form.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-start">
                          <MessageSquare size={16} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="truncate max-w-xs" title={form.comments}>
                            {form.comments || 'No comments'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {form.status === 'completed' ? (
                          <button
                            onClick={() => generatePDF(form)}
                            className="inline-flex items-center space-x-1 text-green-600 hover:text-green-900 transition-colors"
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}