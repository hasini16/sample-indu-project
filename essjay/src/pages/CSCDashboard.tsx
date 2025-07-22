import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { FormData, ServiceRequestFormData } from '../types';
import { db } from '../services/database';
import { Eye, Edit, CheckCircle, Calendar, AlertCircle, CheckCircle2, FileText, Settings } from 'lucide-react';

export function CSCDashboard() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [pendingForms, setPendingForms] = useState<FormData[]>([]);
  const [completedForms, setCompletedForms] = useState<FormData[]>([]);
  const [pendingServiceRequests, setPendingServiceRequests] = useState<ServiceRequestFormData[]>([]);
  const [completedServiceRequests, setCompletedServiceRequests] = useState<ServiceRequestFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forms' | 'service-requests'>('service-requests');

  useEffect(() => {
    if (userType !== 'csc' || !user) {
      navigate('/');
      return;
    }
          loadForms();
      loadServiceRequests();
    }, [user, userType, navigate]);
  
    const loadForms = async () => {
      try {
        const allForms = await db.getAllForms();
        
        const pending = allForms.filter(form => 
          form.status === 'submitted' || 
          form.status === 're-submitted' || 
          form.status === 'under process' || 
          form.status === 'action needed'
        );
        
        const completed = allForms.filter(form => form.status === 'completed');
        
        setPendingForms(pending);
        setCompletedForms(completed);
      } catch (error) {
        console.error('Error loading forms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadServiceRequests = async () => {
      try {
        const allServiceRequests = await db.getAllServiceRequests();
        
        const pending = allServiceRequests.filter(request => 
          request.status === 'submitted' || 
          request.status === 're-submitted' || 
          request.status === 'under process' || 
          request.status === 'action needed'
        );
        
        const completed = allServiceRequests.filter(request => request.status === 'completed');
        
        setPendingServiceRequests(pending);
        setCompletedServiceRequests(completed);
      } catch (error) {
        console.error('Error loading service requests:', error);
      }
    };

  const handleViewForm = (form: FormData) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const handleEditForm = (form: FormData) => {
    navigate(`/edit-form/${form.id}`);
  };

  const handleCompleteForm = async (formId: string) => {
    setProcessingId(formId);
    try {
      await db.updateForm(formId, { 
        status: 'completed',
        comments: 'Form completed by CSC'
      });
      loadForms(); // Refresh the forms
      alert('Form has been successfully completed!');
    } catch (error) {
      console.error('Error completing form:', error);
      alert('Error completing form. Please try again.');
    } finally {
      setProcessingId(null);
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

  const FormModal = ({ form, onClose }: { form: FormData; onClose: () => void }) => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Form Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Form Header */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Form ID</label>
                <p className="mt-1 text-sm text-gray-900">{form.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(form.submissionTime).toLocaleDateString()} at {new Date(form.submissionTime).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                  {form.status}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{form.personalInfo.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{form.personalInfo.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{form.personalInfo.phone}</p>
              </div>
              {form.personalInfo.dateOfBirth && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">{form.personalInfo.dateOfBirth}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{form.personalInfo.address}</p>
              </div>
              {form.personalInfo.idNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Number</label>
                  <p className="mt-1 text-sm text-gray-900">{form.personalInfo.idNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Type</label>
                  <p className="mt-1 text-sm text-gray-900">{form.serviceDetails.serviceType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Urgency</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    form.serviceDetails.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    form.serviceDetails.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {form.serviceDetails.urgency.toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{form.serviceDetails.description}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(form.additionalInfo?.notes || form.additionalInfo?.preferences) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                {form.additionalInfo.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{form.additionalInfo.notes}</p>
                  </div>
                )}
                {form.additionalInfo.preferences && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Communication Preferences</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{form.additionalInfo.preferences}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments */}
          {form.comments && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{form.comments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border border-green-500 rounded-full animate-spin" style={{ borderTopColor: 'transparent', borderWidth: '4px' }}></div>
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
            CSC Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and process user service requests
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('service-requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'service-requests'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Settings className="mr-2" size={20} />
                  Service Requests ({pendingServiceRequests.length} pending)
                </div>
              </button>
              <button
                onClick={() => setActiveTab('forms')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'forms'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <FileText className="mr-2" size={20} />
                  Simple Forms ({pendingForms.length} pending)
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Service Requests Tab */}
        {activeTab === 'service-requests' && (
          <>
            {/* Pending Service Requests */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <AlertCircle className="mr-2" size={24} style={{ color: 'var(--color-orange-500)' }} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pending Service Requests ({pendingServiceRequests.length})
                  </h2>
                </div>
              </div>
              
              {pendingServiceRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending service requests</h3>
                  <p className="text-gray-600">All service requests have been processed</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Request ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Organization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Service Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingServiceRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.serviceRequestNo || request.id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.organizationName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.calibrationService}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => navigate(`/csc-service-request/${request.id}`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <Eye size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Completed Service Requests */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="mr-2" size={24} style={{ color: 'var(--color-green-500)' }} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Completed Service Requests ({completedServiceRequests.length})
                  </h2>
                </div>
              </div>
              
              {completedServiceRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed service requests</h3>
                  <p className="text-gray-600">Completed requests will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Request ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Organization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Completed Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedServiceRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.serviceRequestNo || request.id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.organizationName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(request.submissionTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => navigate(`/csc-service-request/${request.id}`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <Eye size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Forms Tab */}
        {activeTab === 'forms' && (
          <>
            {/* Pending Forms Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <AlertCircle className="mr-2" size={24} style={{ color: 'var(--color-orange-500)' }} />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pending Forms ({pendingForms.length})
                  </h2>
                </div>
              </div>
          
          {pendingForms.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending forms</h3>
              <p className="text-gray-600">All forms have been processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Form ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Submitter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingForms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.personalInfo.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.serviceDetails.serviceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                          {form.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewForm(form)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditForm(form)}
                            className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleCompleteForm(form.id)}
                            disabled={processingId === form.id}
                            className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-50 transition-colors"
                            style={{ 
                              opacity: processingId === form.id ? 0.6 : 1,
                              cursor: processingId === form.id ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <CheckCircle size={16} className="mr-1" />
                            {processingId === form.id ? 'Processing...' : 'Complete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Completed Forms Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2" size={24} style={{ color: 'var(--color-green-500)' }} />
              <h2 className="text-xl font-semibold text-gray-900">
                Completed Forms ({completedForms.length})
              </h2>
            </div>
          </div>
          
          {completedForms.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed forms</h3>
              <p className="text-gray-600">Completed forms will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Form ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Submitter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Completion Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedForms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.personalInfo.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.serviceDetails.serviceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {new Date(form.submissionTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewForm(form)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedForm && (
        <FormModal 
          form={selectedForm} 
          onClose={() => {
            setShowModal(false);
            setSelectedForm(null);
          }} 
        />
      )}
    </div>
  );
}