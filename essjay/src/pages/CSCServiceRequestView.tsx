import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import type { ServiceRequestFormData } from '../types';
import { db } from '../services/database';
import { 
  Save, 
  Building, 
  Settings, 
  FileText, 
  AlertTriangle, 
  ArrowLeft,
  Shield,
  MessageSquare,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

export function CSCServiceRequestView() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequestFormData | null>(null);
  const [cscRemarks, setCscRemarks] = useState('');
  const [cscInternalNotes, setCscInternalNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);

  useEffect(() => {
    if (userType !== 'csc' || !user) {
      navigate('/');
      return;
    }
    if (requestId) {
      loadServiceRequest();
    }
  }, [user, userType, navigate, requestId]);

  const loadServiceRequest = async () => {
    if (!requestId) return;
    
    try {
      const request = await db.getServiceRequestById(requestId);
      if (request) {
        setServiceRequest(request);
        setCscRemarks(request.cscRemarks || '');
        setCscInternalNotes(request.cscInternalNotes || '');
      } else {
        setError('Service request not found');
      }
    } catch (error) {
      console.error('Error loading service request:', error);
      setError('Error loading service request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCSCFields = async () => {
    if (!serviceRequest) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const updates = {
        cscRemarks,
        cscInternalNotes
      };
      
      const updatedRequest = await db.updateServiceRequest(serviceRequest.id, updates);
      if (updatedRequest) {
        setServiceRequest(updatedRequest);
        setError('');
        // Show success briefly
        setTimeout(() => setError(''), 2000);
      }
    } catch (error) {
      console.error('Error saving CSC fields:', error);
      setError('Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar showBackButton onBack={() => navigate('/csc-dashboard')} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar showBackButton onBack={() => navigate('/csc-dashboard')} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error || 'Service request not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar showBackButton onBack={() => navigate('/csc-dashboard')} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
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
              <p className="text-xs text-gray-500">CSC View - Service Request Details</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Service Request: {serviceRequest.serviceRequestNo || serviceRequest.id}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              serviceRequest.status === 'completed' ? 'bg-green-100 text-green-800' :
              serviceRequest.status === 'under process' ? 'bg-blue-100 text-blue-800' :
              serviceRequest.status === 'action needed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {serviceRequest.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div className={`mb-6 border-l-4 p-4 rounded-r-lg ${
            error.includes('saved') || error.includes('success') 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${
                error.includes('saved') || error.includes('success') 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`} />
              <p className={
                error.includes('saved') || error.includes('success') 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }>{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Service Request Info - Always Visible */}
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Request No:</label>
                  <p className="text-lg text-gray-900">{serviceRequest.serviceRequestNo || 'Auto-generated'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date:</label>
                  <p className="text-lg text-gray-900">{new Date(serviceRequest.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Work Order No:</label>
                  <p className="text-lg text-gray-900">{serviceRequest.workOrderNo || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details - Hidden by default, with toggle */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-xl mr-4">
                    <Building size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Customer Details</h2>
                    <p className="text-purple-100">Organization and contact information</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPersonalDetails(!showPersonalDetails)}
                  className="bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-colors"
                  title={showPersonalDetails ? "Hide personal details" : "Show personal details"}
                >
                  {showPersonalDetails ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
            
            {showPersonalDetails ? (
              <div className="p-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 font-medium">
                      Personal Details - Confidential Information
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name:</label>
                      <p className="text-lg text-gray-900">{serviceRequest.organizationName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Address:</label>
                      <p className="text-lg text-gray-900 whitespace-pre-line">{serviceRequest.organizationAddress}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person:</label>
                      <p className="text-lg text-gray-900">{serviceRequest.contactPerson}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone:</label>
                        <p className="text-lg text-gray-900">{serviceRequest.phoneNo}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email:</label>
                        <p className="text-lg text-gray-900">{serviceRequest.emailId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Personal details hidden for privacy</p>
                <p className="text-sm text-gray-500">Click the eye icon to view confidential information</p>
              </div>
            )}
          </div>

          {/* Calibration Details - Always Visible */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Calibration Service:</label>
                    <p className="text-lg text-gray-900 capitalize">{serviceRequest.calibrationService.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instrument Condition:</label>
                    <p className="text-lg text-gray-900 capitalize">{serviceRequest.instrumentCondition === 'ok' ? 'OK' : 'Not OK'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Request Date:</label>
                    <p className="text-lg text-gray-900">{new Date(serviceRequest.calibrationRequestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Delivery:</label>
                    <p className="text-lg text-gray-900">{new Date(serviceRequest.targetDeliveryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {serviceRequest.instrumentList && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instruments List:</label>
                    <p className="text-lg text-gray-900 whitespace-pre-line">{serviceRequest.instrumentList}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CSC Internal Fields - Editable */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-8 py-6">
              <div className="flex items-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">CSC Internal Fields</h2>
                  <p className="text-yellow-100">Your remarks and internal notes</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CSC Remarks
                  </label>
                  <textarea
                    rows={4}
                    value={cscRemarks}
                    onChange={(e) => setCscRemarks(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-yellow-200 bg-yellow-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-300 transition-all duration-200 resize-none"
                    placeholder="Enter CSC remarks and notes for this service request..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CSC Internal Notes
                  </label>
                  <textarea
                    rows={4}
                    value={cscInternalNotes}
                    onChange={(e) => setCscInternalNotes(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-yellow-200 bg-yellow-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-300 transition-all duration-200 resize-none"
                    placeholder="Internal tracking notes (not visible to customer)..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveCSCFields}
                    disabled={isSaving}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save CSC Fields
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Remarks - Read Only */}
          {serviceRequest.overallRemarks && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                <div className="flex items-center text-white">
                  <div className="bg-white/20 p-3 rounded-xl mr-4">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Customer Remarks</h2>
                    <p className="text-indigo-100">Final comments from customer</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-lg text-gray-900 whitespace-pre-line bg-gray-50 p-4 rounded-xl">
                  {serviceRequest.overallRemarks}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}