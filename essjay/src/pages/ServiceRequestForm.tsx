import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { ServiceRequestFormData } from '../types';
import { db } from '../services/database';
import { 
  Save, 
  Building, 
  Calendar, 
  Settings, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  ClipboardCheck,
  Shield,
  Target,
  MessageSquare
} from 'lucide-react';

export function ServiceRequestForm() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<ServiceRequestFormData, 'id' | 'submissionTime' | 'userId' | 'status'>>({
    // Service Request Details
    serviceRequestNo: '',
    date: new Date().toISOString().split('T')[0],
    workOrderNo: '',
    
    // Customer/Organization Details
    organizationName: '',
    organizationAddress: '',
    contactPerson: '',
    phoneNo: '',
    faxNo: '',
    mobileNo: '',
    emailId: '',
    
    // Calibration Details
    calibrationService: 'atLaboratory',
    calibrationRequestDate: '',
    targetDeliveryDate: '',
    frequencyOfCalibration: '',
    
    // Instrument Condition
    instrumentCondition: 'ok',
    
    // Calibration Method
    calibrationMethod: 'asPerWorkInstruction',
    
    // NABL Parameters
    parameterUnderNABL: false,
    statementOfConformity: false,
    
    // Pass/Fail Criteria
    obsReading: '',
    muValue: '',
    uslValue: '',
    lslValue: '',
    
    // Additional Questions
    differenceWithContactTender: false,
    differenceResolved: false,
    contactAccepted: false,
    deviationFromContract: false,
    deviationDetails: '',
    contractAmended: false,
    contractReviewRepeated: false,
    amendedContractCommunicated: false,
    clarificationAsked: false,
    witnessAsked: false,
    witnessActivity: [],
    
    // Terms and Conditions
    priceAsPerPriceList: '',
    paymentTerms: '',
    deliveryMode: '',
    agreedDeliveryDateInstrument: '',
    agreedDeliveryDateCertificate: '',
    manualProvided: false,
    instrumentList: '',
    
    // Signatures
    customerSignature: '',
    overallRemarks: '',
    
    // CSC Only Fields
    cscRemarks: '',
    cscInternalNotes: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const witnessActivities = ['Calibration', 'Preparation', 'Packaging', 'Dispatch'];

  // Input change handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleWitnessActivityChange = (activity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      witnessActivity: checked 
        ? [...prev.witnessActivity, activity]
        : prev.witnessActivity.filter(a => a !== activity)
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.organizationName.trim()) {
      errors.organizationName = 'Organization name is required';
    }
    if (!formData.organizationAddress.trim()) {
      errors.organizationAddress = 'Organization address is required';
    }
    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }
    if (!formData.phoneNo.trim()) {
      errors.phoneNo = 'Phone number is required';
    }
    if (!formData.emailId.trim()) {
      errors.emailId = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      errors.emailId = 'Please enter a valid email address';
    }
    if (!formData.calibrationRequestDate) {
      errors.calibrationRequestDate = 'Calibration request date is required';
    }
    if (!formData.targetDeliveryDate) {
      errors.targetDeliveryDate = 'Target delivery date is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getCompletionPercentage = () => {
    const requiredFields = [
      'organizationName', 'organizationAddress', 'contactPerson', 
      'phoneNo', 'emailId', 'calibrationRequestDate', 'targetDeliveryDate'
    ];
    
    let completed = 0;
    requiredFields.forEach(field => {
      if (formData[field as keyof typeof formData] && 
          String(formData[field as keyof typeof formData]).trim()) {
        completed++;
      }
    });
    
    return Math.round((completed / requiredFields.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors above before submitting');
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
      const newForm: Omit<ServiceRequestFormData, 'id' | 'submissionTime'> = {
        userId: user.id,
        status: 'submitted',
        ...formData
      };
      
      const createdServiceRequest = await db.createServiceRequest(newForm);
      console.log('Service request created successfully:', createdServiceRequest);
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 1000);
      
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar showBackButton onBack={() => navigate('/user-dashboard')} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/logo.svg" 
              alt="Essjay Technomeasure" 
              className="h-16 w-16 mr-4"
            />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">ESSJAY TECHNOMEASURE PRIVATE LIMITED</h1>
              <p className="text-sm text-gray-600">(ISO 9001 Certified Org. & NABL Accredited Laboratory)</p>
              <p className="text-xs text-gray-500">D1, 3rd Floor, 16 Garpar Road, Salkia, Howrah-711 101</p>
              <p className="text-xs text-gray-500">Ph.:033 2667 0835, Website: www.technomeasurenabl.com</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
            SERVICE REQUEST FORM
          </h2>
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Request Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Service Request Information</h2>
                  <p className="text-blue-100">Basic request details</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Service Request No:
                  </label>
                  <input
                    type="text"
                    value={formData.serviceRequestNo}
                    onChange={(e) => handleInputChange('serviceRequestNo', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                    placeholder="Auto-generated"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Work Order No:
                  </label>
                  <input
                    type="text"
                    value={formData.workOrderNo}
                    onChange={(e) => handleInputChange('workOrderNo', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                    placeholder="Enter work order number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <Building size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Customer Details</h2>
                  <p className="text-purple-100">Organization and contact information</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Name of Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.organizationName 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter organization name"
                    />
                    {fieldErrors.organizationName && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertTriangle size={14} className="mr-1" />
                        {fieldErrors.organizationName}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Address of Organization <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.organizationAddress}
                      onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none ${
                        fieldErrors.organizationAddress 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter complete organization address"
                    />
                    {fieldErrors.organizationAddress && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertTriangle size={14} className="mr-1" />
                        {fieldErrors.organizationAddress}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.contactPerson 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter contact person name"
                    />
                    {fieldErrors.contactPerson && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertTriangle size={14} className="mr-1" />
                        {fieldErrors.contactPerson}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Phone No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNo}
                        onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          fieldErrors.phoneNo 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Phone number"
                      />
                      {fieldErrors.phoneNo && (
                        <p className="text-red-600 text-sm flex items-center mt-1">
                          <AlertTriangle size={14} className="mr-1" />
                          {fieldErrors.phoneNo}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Fax No
                      </label>
                      <input
                        type="tel"
                        value={formData.faxNo}
                        onChange={(e) => handleInputChange('faxNo', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                        placeholder="Fax number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Mobile No
                      </label>
                      <input
                        type="tel"
                        value={formData.mobileNo}
                        onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                        placeholder="Mobile number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.emailId}
                        onChange={(e) => handleInputChange('emailId', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          fieldErrors.emailId 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Email address"
                      />
                      {fieldErrors.emailId && (
                        <p className="text-red-600 text-sm flex items-center mt-1">
                          <AlertTriangle size={14} className="mr-1" />
                          {fieldErrors.emailId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calibration Details Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <Settings size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Calibration Details</h2>
                  <p className="text-green-100">Service specifications and requirements</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                {/* Calibration Service Type */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Calibration Service <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="calibrationService"
                        value="atLaboratory"
                        checked={formData.calibrationService === 'atLaboratory'}
                        onChange={(e) => handleInputChange('calibrationService', e.target.value)}
                        className="mr-2"
                      />
                      At Laboratory
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="calibrationService"
                        value="atSite"
                        checked={formData.calibrationService === 'atSite'}
                        onChange={(e) => handleInputChange('calibrationService', e.target.value)}
                        className="mr-2"
                      />
                      At Site
                    </label>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Calibration Request Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.calibrationRequestDate}
                      onChange={(e) => handleInputChange('calibrationRequestDate', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.calibrationRequestDate 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {fieldErrors.calibrationRequestDate && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertTriangle size={14} className="mr-1" />
                        {fieldErrors.calibrationRequestDate}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Target Date of Delivery <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.targetDeliveryDate}
                      onChange={(e) => handleInputChange('targetDeliveryDate', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.targetDeliveryDate 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {fieldErrors.targetDeliveryDate && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertTriangle size={14} className="mr-1" />
                        {fieldErrors.targetDeliveryDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Frequency and Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Frequency of Calibration (Customer recommendation)
                    </label>
                    <input
                      type="text"
                      value={formData.frequencyOfCalibration}
                      onChange={(e) => handleInputChange('frequencyOfCalibration', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                      placeholder="e.g., Annually, Quarterly, etc."
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Condition of Instrument
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="instrumentCondition"
                          value="ok"
                          checked={formData.instrumentCondition === 'ok'}
                          onChange={(e) => handleInputChange('instrumentCondition', e.target.value)}
                          className="mr-2"
                        />
                        Ok
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="instrumentCondition"
                          value="notOk"
                          checked={formData.instrumentCondition === 'notOk'}
                          onChange={(e) => handleInputChange('instrumentCondition', e.target.value)}
                          className="mr-2"
                        />
                        Not Ok
                      </label>
                    </div>
                  </div>
                </div>

                {/* Calibration Method */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Calibration Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="calibrationMethod"
                        value="asPerWorkInstruction"
                        checked={formData.calibrationMethod === 'asPerWorkInstruction'}
                        onChange={(e) => handleInputChange('calibrationMethod', e.target.value)}
                        className="mr-2"
                      />
                      As per work instruction WI-01
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="calibrationMethod"
                        value="asPerScopeOfAccreditation"
                        checked={formData.calibrationMethod === 'asPerScopeOfAccreditation'}
                        onChange={(e) => handleInputChange('calibrationMethod', e.target.value)}
                        className="mr-2"
                      />
                      As per scope of accreditation
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="calibrationMethod"
                        value="inAppropriate"
                        checked={formData.calibrationMethod === 'inAppropriate'}
                        onChange={(e) => handleInputChange('calibrationMethod', e.target.value)}
                        className="mr-2"
                      />
                      In appropriate
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="calibrationMethod"
                        value="outOfDate"
                        checked={formData.calibrationMethod === 'outOfDate'}
                        onChange={(e) => handleInputChange('calibrationMethod', e.target.value)}
                        className="mr-2"
                      />
                      Out of date
                    </label>
                  </div>
                </div>

                {/* NABL Parameters */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.parameterUnderNABL}
                        onChange={(e) => handleInputChange('parameterUnderNABL', e.target.checked)}
                        className="mr-2"
                      />
                      Parameter comes under NABL accreditation? Yes / No
                    </label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.statementOfConformity}
                        onChange={(e) => handleInputChange('statementOfConformity', e.target.checked)}
                        className="mr-2"
                      />
                      Statement of Conformity (Pass/Fail) required in the certificate? Yes / No
                    </label>
                  </div>
                </div>

                {/* Pass/Fail Criteria */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Pass/Fail Criteria (if yes):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Obs reading
                      </label>
                      <input
                        type="text"
                        value={formData.obsReading}
                        onChange={(e) => handleInputChange('obsReading', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+ MU ≤ USL"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        MU
                      </label>
                      <input
                        type="text"
                        value={formData.muValue}
                        onChange={(e) => handleInputChange('muValue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="- MU ≥ USL"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        USL
                      </label>
                      <input
                        type="text"
                        value={formData.uslValue}
                        onChange={(e) => handleInputChange('uslValue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="USL value"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        LSL
                      </label>
                      <input
                        type="text"
                        value={formData.lslValue}
                        onChange={(e) => handleInputChange('lslValue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="LSL value"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    MU (Measurement of Uncertainty), USL (Upper Specification Limit), LSL (Lower Specification Limit), Obs (Observation)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Questions Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Additional Information</h2>
                  <p className="text-orange-100">Contract and process details</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                {/* Yes/No Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">Any difference with contact/Tender</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="differenceWithContactTender"
                            checked={formData.differenceWithContactTender === true}
                            onChange={() => handleInputChange('differenceWithContactTender', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="differenceWithContactTender"
                            checked={formData.differenceWithContactTender === false}
                            onChange={() => handleInputChange('differenceWithContactTender', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">If yes, is it resolved before calibration</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="differenceResolved"
                            checked={formData.differenceResolved === true}
                            onChange={() => handleInputChange('differenceResolved', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="differenceResolved"
                            checked={formData.differenceResolved === false}
                            onChange={() => handleInputChange('differenceResolved', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">Contact accepted by us and customers</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contactAccepted"
                            checked={formData.contactAccepted === true}
                            onChange={() => handleInputChange('contactAccepted', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contactAccepted"
                            checked={formData.contactAccepted === false}
                            onChange={() => handleInputChange('contactAccepted', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">If any deviation from the contract found, is it informed to customer?</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="deviationFromContract"
                            checked={formData.deviationFromContract === true}
                            onChange={() => handleInputChange('deviationFromContract', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="deviationFromContract"
                            checked={formData.deviationFromContract === false}
                            onChange={() => handleInputChange('deviationFromContract', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">Is contract amended after work done</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contractAmended"
                            checked={formData.contractAmended === true}
                            onChange={() => handleInputChange('contractAmended', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contractAmended"
                            checked={formData.contractAmended === false}
                            onChange={() => handleInputChange('contractAmended', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">If yes contract review repeated</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contractReviewRepeated"
                            checked={formData.contractReviewRepeated === true}
                            onChange={() => handleInputChange('contractReviewRepeated', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contractReviewRepeated"
                            checked={formData.contractReviewRepeated === false}
                            onChange={() => handleInputChange('contractReviewRepeated', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">Amended contract review communicated to all affected personnel</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="amendedContractCommunicated"
                            checked={formData.amendedContractCommunicated === true}
                            onChange={() => handleInputChange('amendedContractCommunicated', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="amendedContractCommunicated"
                            checked={formData.amendedContractCommunicated === false}
                            onChange={() => handleInputChange('amendedContractCommunicated', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="text-sm font-medium">Is clarification asked by customer regarding calibration request</span>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="clarificationAsked"
                            checked={formData.clarificationAsked === true}
                            onChange={() => handleInputChange('clarificationAsked', true)}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="clarificationAsked"
                            checked={formData.clarificationAsked === false}
                            onChange={() => handleInputChange('clarificationAsked', false)}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deviation Details */}
                {formData.deviationFromContract && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      If yes, Deviation Details:
                    </label>
                    <textarea
                      rows={3}
                      value={formData.deviationDetails}
                      onChange={(e) => handleInputChange('deviationDetails', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 resize-none"
                      placeholder="Please provide details about the deviation..."
                    />
                  </div>
                )}

                {/* Witness Questions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="text-sm font-medium">Witness asked by customer</span>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="witnessAsked"
                          checked={formData.witnessAsked === true}
                          onChange={() => handleInputChange('witnessAsked', true)}
                          className="mr-1"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="witnessAsked"
                          checked={formData.witnessAsked === false}
                          onChange={() => handleInputChange('witnessAsked', false)}
                          className="mr-1"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {formData.witnessAsked && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        If yes, what witness activity?
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {witnessActivities.map((activity) => (
                          <label key={activity} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.witnessActivity.includes(activity)}
                              onChange={(e) => handleWitnessActivityChange(activity, e.target.checked)}
                              className="mr-2"
                            />
                            {activity}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Other Terms and Conditions</h2>
                  <p className="text-teal-100">Delivery and payment details</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Price: as per price list/quotation no / Work Order
                    </label>
                    <input
                      type="text"
                      value={formData.priceAsPerPriceList}
                      onChange={(e) => handleInputChange('priceAsPerPriceList', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                      placeholder="Enter price details"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Payment terms: within _____ days / as per quotation
                    </label>
                    <input
                      type="text"
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                      placeholder="e.g., within 30 days"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mode of delivery of certificate: by courier / hand delivery
                    </label>
                    <select
                      value={formData.deliveryMode}
                      onChange={(e) => handleInputChange('deliveryMode', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                    >
                      <option value="">Select delivery mode</option>
                      <option value="courier">By Courier</option>
                      <option value="handDelivery">Hand Delivery</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.manualProvided}
                        onChange={(e) => handleInputChange('manualProvided', e.target.checked)}
                        className="mr-2"
                      />
                      Manual – Provided/Not provided
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Agreed delivery date: instrument
                    </label>
                    <input
                      type="date"
                      value={formData.agreedDeliveryDateInstrument}
                      onChange={(e) => handleInputChange('agreedDeliveryDateInstrument', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Agreed delivery date: certificate
                    </label>
                    <input
                      type="date"
                      value={formData.agreedDeliveryDateCertificate}
                      onChange={(e) => handleInputChange('agreedDeliveryDateCertificate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    List of instruments: Refers to Annexure I
                  </label>
                  <textarea
                    rows={4}
                    value={formData.instrumentList}
                    onChange={(e) => handleInputChange('instrumentList', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 resize-none"
                    placeholder="List all instruments to be calibrated..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Signatures and Remarks Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Signatures and Remarks</h2>
                  <p className="text-indigo-100">Final confirmation and notes</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Customer's Signature with stamp
                    </label>
                    <input
                      type="text"
                      value={formData.customerSignature}
                      onChange={(e) => handleInputChange('customerSignature', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
                      placeholder="Enter signature confirmation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Overall remarks
                    </label>
                    <textarea
                      rows={3}
                      value={formData.overallRemarks}
                      onChange={(e) => handleInputChange('overallRemarks', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 resize-none"
                      placeholder="Enter any additional remarks..."
                    />
                  </div>
                </div>

                {/* CSC Only Fields */}
                {userType === 'csc' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">CSC Internal Fields</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          CSC Remarks
                        </label>
                        <textarea
                          rows={3}
                          value={formData.cscRemarks}
                          onChange={(e) => handleInputChange('cscRemarks', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-yellow-200 bg-yellow-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-300 transition-all duration-200 resize-none"
                          placeholder="CSC remarks and notes..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          CSC Internal Notes
                        </label>
                        <textarea
                          rows={3}
                          value={formData.cscInternalNotes}
                          onChange={(e) => handleInputChange('cscInternalNotes', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-yellow-200 bg-yellow-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-300 transition-all duration-200 resize-none"
                          placeholder="Internal tracking notes..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 mr-3" />
                  Submit Service Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}