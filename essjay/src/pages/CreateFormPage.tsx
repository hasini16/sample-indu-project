import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { FormData } from '../types';
import { db } from '../services/database';
import { Save, User, Settings, FileText, CheckCircle, AlertTriangle, Info, ArrowLeft } from 'lucide-react';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

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
    { 
      value: 'low', 
      label: 'Low Priority', 
      description: 'Standard processing time (5-7 business days)',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: '🟢'
    },
    { 
      value: 'medium', 
      label: 'Medium Priority', 
      description: 'Moderate priority (2-3 business days)',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
      icon: '🟡'
    },
    { 
      value: 'high', 
      label: 'High Priority', 
      description: 'Urgent - requires immediate attention (24-48 hours)',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: '🔴'
    }
  ];

  useEffect(() => {
    if (userType !== 'user' || !user) {
      navigate('/');
      return;
    }
  }, [user, userType, navigate]);

  const validateField = (section: string, field: string, value: string) => {
    const fieldKey = `${section}.${field}`;
    let errorMessage = '';

    if (section === 'personalInfo') {
      switch (field) {
        case 'fullName':
          if (!value.trim()) errorMessage = 'Full name is required';
          else if (value.trim().length < 2) errorMessage = 'Name must be at least 2 characters';
          break;
        case 'email':
          if (!value.trim()) errorMessage = 'Email is required';
          else if (!/\S+@\S+\.\S+/.test(value)) errorMessage = 'Please enter a valid email address';
          break;
        case 'phone':
          if (!value.trim()) errorMessage = 'Phone number is required';
          else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value)) errorMessage = 'Please enter a valid phone number';
          break;
        case 'address':
          if (!value.trim()) errorMessage = 'Address is required';
          else if (value.trim().length < 10) errorMessage = 'Please provide a complete address';
          break;
      }
    } else if (section === 'serviceDetails') {
      switch (field) {
        case 'serviceType':
          if (!value) errorMessage = 'Please select a service type';
          break;
        case 'description':
          if (!value.trim()) errorMessage = 'Service description is required';
          else if (value.trim().length < 10) errorMessage = 'Description must be at least 10 characters';
          break;
      }
    }

    setFieldErrors(prev => ({
      ...prev,
      [fieldKey]: errorMessage
    }));

    return !errorMessage;
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
    
    // Real-time validation
    validateField('personalInfo', name, value);
    
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
    
    // Real-time validation
    validateField('serviceDetails', name, value);
    
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
    const newFieldErrors: Record<string, string> = {};
    
    // Validate personal information
    Object.entries(personalInfo).forEach(([key, value]) => {
      if (['fullName', 'email', 'phone', 'address'].includes(key)) {
        if (!validateField('personalInfo', key, value)) {
          const fieldKey = `personalInfo.${key}`;
          if (!fieldErrors[fieldKey]) {
            newFieldErrors[fieldKey] = 'This field is required';
          }
        }
      }
    });
    
    // Validate service details
    if (!validateField('serviceDetails', 'serviceType', serviceDetails.serviceType)) {
      newFieldErrors['serviceDetails.serviceType'] = 'Please select a service type';
    }
    if (!validateField('serviceDetails', 'description', serviceDetails.description)) {
      newFieldErrors['serviceDetails.description'] = 'Service description is required';
    }
    
    setFieldErrors(prev => ({ ...prev, ...newFieldErrors }));
    
    return Object.keys(newFieldErrors).length === 0 && Object.values(fieldErrors).every(error => !error);
  };

  const getCompletionPercentage = () => {
    const totalFields = 6; // fullName, email, phone, address, serviceType, description
    const { personalInfo, serviceDetails } = formData;
    
    let completed = 0;
    if (personalInfo.fullName.trim()) completed++;
    if (personalInfo.email.trim()) completed++;
    if (personalInfo.phone.trim()) completed++;
    if (personalInfo.address.trim()) completed++;
    if (serviceDetails.serviceType) completed++;
    if (serviceDetails.description.trim()) completed++;
    
    return Math.round((completed / totalFields) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted!'); // Debug log
    
    if (!validateForm()) {
      setError('Please fix the errors above before submitting');
      // Scroll to first error
      const firstErrorElement = document.querySelector('.border-red-300');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (!user) {
      setError('User not authenticated. Please log in again.');
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
      
      console.log('Creating form:', newForm); // Debug log
      
      const createdForm = await db.createForm(newForm);
      console.log('Form created successfully:', createdForm); // Debug log
      
      // Show success message briefly before redirecting
      setError('');
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 1000);
      
    } catch (err) {
      console.error('Form submission error:', err); // Debug log
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar showBackButton onBack={() => navigate('/user-dashboard')} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Service Request</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Submit your service request with ease. Our team will review and process it promptly.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Form Completion</span>
              <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl shadow-sm">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <p className="text-blue-100">Tell us about yourself</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors['personalInfo.fullName'] 
                        ? 'border-red-300 bg-red-50' 
                        : formData.personalInfo.fullName 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {fieldErrors['personalInfo.fullName'] && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertTriangle size={14} className="mr-1" />
                      {fieldErrors['personalInfo.fullName']}
                    </p>
                  )}
                  {formData.personalInfo.fullName && !fieldErrors['personalInfo.fullName'] && (
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <CheckCircle size={14} className="mr-1" />
                      Looks good!
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors['personalInfo.email'] 
                        ? 'border-red-300 bg-red-50' 
                        : formData.personalInfo.email && !fieldErrors['personalInfo.email']
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {fieldErrors['personalInfo.email'] && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertTriangle size={14} className="mr-1" />
                      {fieldErrors['personalInfo.email']}
                    </p>
                  )}
                  {formData.personalInfo.email && !fieldErrors['personalInfo.email'] && (
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <CheckCircle size={14} className="mr-1" />
                      Valid email address
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors['personalInfo.phone'] 
                        ? 'border-red-300 bg-red-50' 
                        : formData.personalInfo.phone && !fieldErrors['personalInfo.phone']
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {fieldErrors['personalInfo.phone'] && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertTriangle size={14} className="mr-1" />
                      {fieldErrors['personalInfo.phone']}
                    </p>
                  )}
                  {formData.personalInfo.phone && !fieldErrors['personalInfo.phone'] && (
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <CheckCircle size={14} className="mr-1" />
                      Valid phone number
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                      fieldErrors['personalInfo.address'] 
                        ? 'border-red-300 bg-red-50' 
                        : formData.personalInfo.address && !fieldErrors['personalInfo.address']
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your complete address including street, city, state, and postal code"
                  />
                  {fieldErrors['personalInfo.address'] && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertTriangle size={14} className="mr-1" />
                      {fieldErrors['personalInfo.address']}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-700">
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.personalInfo.idNumber}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                    placeholder="Enter your ID number (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <Settings size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Service Details</h2>
                  <p className="text-green-100">What can we help you with?</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    value={formData.serviceDetails.serviceType}
                    onChange={handleServiceDetailsChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors['serviceDetails.serviceType'] 
                        ? 'border-red-300 bg-red-50' 
                        : formData.serviceDetails.serviceType
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option value="">Select a service type</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {fieldErrors['serviceDetails.serviceType'] && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertTriangle size={14} className="mr-1" />
                      {fieldErrors['serviceDetails.serviceType']}
                    </p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Urgency Level <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {urgencyLevels.map((level) => (
                      <label key={level.value} className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        formData.serviceDetails.urgency === level.value 
                          ? `${level.bgColor} border-current` 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={formData.serviceDetails.urgency === level.value}
                          onChange={handleServiceDetailsChange}
                          className="mt-1 mr-3 scale-125"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{level.icon}</span>
                            <span className={`font-semibold ${level.color}`}>{level.label}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-2 space-y-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                    Service Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    value={formData.serviceDetails.description}
                    onChange={handleServiceDetailsChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                      fieldErrors['serviceDetails.description'] 
                        ? 'border-red-300 bg-red-50' 
                        : formData.serviceDetails.description && !fieldErrors['serviceDetails.description']
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Please describe your service request in detail. Include any specific requirements, timeline expectations, or other relevant information..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {fieldErrors['serviceDetails.description'] ? (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        {fieldErrors['serviceDetails.description']}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm flex items-center">
                        <Info size={14} className="mr-1" />
                        Minimum 10 characters. Be as specific as possible.
                      </p>
                    )}
                    <span className="text-sm text-gray-500">
                      {formData.serviceDetails.description.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Additional Information</h2>
                  <p className="text-purple-100">Optional details to help us serve you better</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.additionalInfo.notes}
                  onChange={handleAdditionalInfoChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 resize-none"
                  placeholder="Any additional information, special requirements, or notes you'd like to share..."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="preferences" className="block text-sm font-semibold text-gray-700">
                  Communication Preferences
                </label>
                <textarea
                  id="preferences"
                  name="preferences"
                  rows={3}
                  value={formData.additionalInfo.preferences}
                  onChange={handleAdditionalInfoChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 resize-none"
                  placeholder="Preferred contact method, best times to reach you, or other communication preferences..."
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                type="button"
                onClick={() => navigate('/user-dashboard')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
              
              <button
                type="submit"
                disabled={isLoading || progressPercentage < 100}
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-12 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
            
            {progressPercentage < 100 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800 text-sm flex items-center">
                  <Info size={16} className="mr-2" />
                  Please complete all required fields before submitting your request.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}