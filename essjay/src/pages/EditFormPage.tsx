import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { FormData } from '../types';
import { db } from '../services/database';
import { Save, User, Settings, FileText, MessageSquare } from 'lucide-react';

export function EditFormPage() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();
  
  const [form, setForm] = useState<FormData | null>(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      idNumber: ''
    },
    serviceDetails: {
      serviceType: '',
      description: '',
      urgency: 'medium' as 'low' | 'medium' | 'high'
    },
    additionalInfo: {
      notes: '',
      preferences: ''
    },
    status: 'submitted' as FormData['status'],
    comments: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const serviceTypes = [
    'Technical Support',
    'Laboratory Testing',
    'Consultation',
    'Equipment Maintenance',
    'Data Analysis',
    'Research Services',
    'Quality Assurance',
    'Training Services',
    'Custom Development',
    'Other'
  ];

  const statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 're-submitted', label: 'Re-submitted' },
    { value: 'under process', label: 'Under Process' },
    { value: 'action needed', label: 'Action Needed' },
    { value: 'completed', label: 'Completed' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Standard processing time' },
    { value: 'medium', label: 'Medium', description: 'Moderate priority' },
    { value: 'high', label: 'High', description: 'Urgent - requires immediate attention' }
  ];

  useEffect(() => {
    if (userType !== 'csc' || !user) {
      navigate('/');
      return;
    }
    loadForm();
  }, [user, userType, navigate, formId]);

  const loadForm = async () => {
    if (!formId) {
      setError('Form ID is required');
      setIsLoading(false);
      return;
    }

    try {
      const loadedForm = await db.getFormById(formId);
      if (!loadedForm) {
        setError('Form not found');
        setIsLoading(false);
        return;
      }

      setForm(loadedForm);
      setFormData({
        personalInfo: {
          fullName: loadedForm.personalInfo.fullName,
          email: loadedForm.personalInfo.email,
          phone: loadedForm.personalInfo.phone,
          address: loadedForm.personalInfo.address,
          dateOfBirth: loadedForm.personalInfo.dateOfBirth || '',
          idNumber: loadedForm.personalInfo.idNumber || ''
        },
        serviceDetails: {
          serviceType: loadedForm.serviceDetails.serviceType,
          description: loadedForm.serviceDetails.description,
          urgency: loadedForm.serviceDetails.urgency
        },
        additionalInfo: {
          notes: loadedForm.additionalInfo?.notes || '',
          preferences: loadedForm.additionalInfo?.preferences || ''
        },
        status: loadedForm.status,
        comments: loadedForm.comments
      });
    } catch (error) {
      console.error('Error loading form:', error);
      setError('Error loading form');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleServiceDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        [name]: value
      }
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleAdditionalInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [name]: value
      }
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as FormData['status']
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      comments: e.target.value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    const { personalInfo, serviceDetails } = formData;
    
    if (!personalInfo.fullName || !personalInfo.email || !personalInfo.phone || !personalInfo.address) {
      return 'Please fill in all required personal information fields';
    }
    
    if (!serviceDetails.serviceType || !serviceDetails.description) {
      return 'Please fill in all required service details';
    }
    
    if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      return 'Please enter a valid email address';
    }
    
    if (serviceDetails.description.length < 10) {
      return 'Service description must be at least 10 characters long';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    if (!form) {
      setError('Form not loaded');
      return;
    }
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const updates: Partial<FormData> = {
        personalInfo: formData.personalInfo,
        serviceDetails: formData.serviceDetails,
        additionalInfo: formData.additionalInfo,
        status: formData.status,
        comments: formData.comments
      };
      
      await db.updateForm(form.id, updates);
      setSuccess('Form updated successfully!');
      
      // Redirect back to CSC dashboard after a short delay
      setTimeout(() => {
        navigate('/csc-dashboard');
      }, 2000);
    } catch (err) {
      setError('An error occurred while updating the form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showBackButton onBack={() => navigate('/csc-dashboard')} />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showBackButton onBack={() => navigate('/csc-dashboard')} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-900 mb-2">Form Not Found</h2>
            <p className="text-red-800">{error || 'The requested form could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showBackButton onBack={() => navigate('/csc-dashboard')} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Form</h1>
          <p className="text-gray-600">Form ID: {form.id}</p>
          <p className="text-gray-600">
            Submitted: {new Date(form.submissionTime).toLocaleDateString()} at {new Date(form.submissionTime).toLocaleTimeString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Status and Comments Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <MessageSquare className="mr-3 text-orange-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Status & Comments</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-1">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={4}
                  value={formData.comments}
                  onChange={handleCommentsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add comments about the form status or required actions..."
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <User className="mr-3 text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.personalInfo.fullName}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  value={formData.personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.personalInfo.idNumber}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Settings className="mr-3 text-green-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Service Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  value={formData.serviceDetails.serviceType}
                  onChange={handleServiceDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {urgencyLevels.map((level) => (
                    <label key={level.value} className="flex items-start">
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.serviceDetails.urgency === level.value}
                        onChange={handleServiceDetailsChange}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.serviceDetails.description}
                  onChange={handleServiceDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <FileText className="mr-3 text-purple-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.additionalInfo.notes}
                  onChange={handleAdditionalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-2">
                  Communication Preferences
                </label>
                <textarea
                  id="preferences"
                  name="preferences"
                  rows={2}
                  value={formData.additionalInfo.preferences}
                  onChange={handleAdditionalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/csc-dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}