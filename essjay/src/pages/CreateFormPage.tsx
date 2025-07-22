import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { FormData } from '../types';
import { db } from '../services/database';
import { Save, User, Settings, FileText } from 'lucide-react';

export function CreateFormPage() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  
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
      urgency: 'medium' as const
    },
    additionalInfo: {
      notes: '',
      preferences: ''
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Standard processing time' },
    { value: 'medium', label: 'Medium', description: 'Moderate priority' },
    { value: 'high', label: 'High', description: 'Urgent - requires immediate attention' }
  ];

  useEffect(() => {
    if (userType !== 'user' || !user) {
      navigate('/');
      return;
    }
  }, [user, userType, navigate]);

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
    
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const newForm: Omit<FormData, 'id' | 'submissionTime'> = {
        userId: user.id,
        status: 'submitted',
        comments: '',
        personalInfo: formData.personalInfo,
        serviceDetails: formData.serviceDetails,
        additionalInfo: formData.additionalInfo
      };
      
      await db.createForm(newForm);
      navigate('/user-dashboard');
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showBackButton onBack={() => navigate('/user-dashboard')} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Service Request</h1>
          <p className="text-gray-600">Fill out the form below to submit your service request</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full address"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your ID number"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your service request in detail..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 10 characters. Be as specific as possible to help us understand your needs.
                </p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information or special requirements..."
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Preferred contact method, times, or other preferences..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/user-dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              <span>{isLoading ? 'Submitting...' : 'Submit Form'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}