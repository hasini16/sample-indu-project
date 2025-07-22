import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { FormData } from '../types';
import { db } from '../services/database';
import { FileText, Plus, Download, Calendar, MessageSquare, AlertCircle, CheckCircle, Clock, User, TrendingUp, Activity, Zap } from 'lucide-react';
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 're-submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under process':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'action needed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: FormData['status']) => {
    switch (status) {
      case 'submitted':
        return <Clock size={16} className="text-blue-600" />;
      case 're-submitted':
        return <Activity size={16} className="text-yellow-600" />;
      case 'under process':
        return <Zap size={16} className="text-purple-600" />;
      case 'action needed':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStats = () => {
    const total = forms.length;
    const completed = forms.filter(f => f.status === 'completed').length;
    const inProgress = forms.filter(f => ['submitted', 're-submitted', 'under process'].includes(f.status)).length;
    const actionNeeded = forms.filter(f => f.status === 'action needed').length;
    
    return { total, completed, inProgress, actionNeeded };
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
    doc.save(`Service_Request_${form.id.slice(0, 8)}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-gray-600">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.firstName || user?.username}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your service requests, monitor progress, and access completed forms all in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">In Progress</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.inProgress}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Action Needed</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.actionNeeded}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600 mt-1">Start a new request or access common features</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/create-form')}
              className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={24} />
              <span>Create New Request</span>
            </button>
            {stats.completed > 0 && (
              <button
                onClick={() => {
                  const completedForm = forms.find(f => f.status === 'completed');
                  if (completedForm) generatePDF(completedForm);
                }}
                className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download size={24} />
                <span>Download Latest Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Service Requests</h2>
                <p className="text-gray-600 mt-1">Track the status and progress of your submissions</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          {forms.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                <FileText size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No requests yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Ready to get started? Create your first service request and we'll help you every step of the way.
              </p>
              <button
                onClick={() => navigate('/create-form')}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={24} />
                <span>Create Your First Request</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Request Details
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {forms.map((form, index) => (
                    <tr key={form.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index !== forms.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">#{form.id.slice(0, 8)}</div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar size={14} className="mr-1" />
                              {new Date(form.submissionTime).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(form.submissionTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-medium text-gray-900">{form.serviceDetails.serviceType}</div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          form.serviceDetails.urgency === 'high' ? 'bg-red-100 text-red-800' :
                          form.serviceDetails.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {form.serviceDetails.urgency} priority
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(form.status)}`}>
                          {getStatusIcon(form.status)}
                          <span className="capitalize">{form.status}</span>
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-start space-x-2 max-w-xs">
                          <MessageSquare size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate" title={form.comments}>
                            {form.comments || (
                              <span className="text-gray-400 italic">No comments yet</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {form.status === 'completed' ? (
                          <button
                            onClick={() => generatePDF(form)}
                            className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200 font-semibold"
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Clock size={16} />
                            <span className="text-sm">Pending</span>
                          </div>
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