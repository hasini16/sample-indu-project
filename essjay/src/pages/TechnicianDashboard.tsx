import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Wrench, Hammer, Settings, FlaskConical } from 'lucide-react';

export function TechnicianDashboard() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userType !== 'technician' || !user) {
      navigate('/');
      return;
    }
  }, [user, userType, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lab Technician Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to the laboratory technician portal
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
                <Wrench size={40} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Laboratory Technician Portal
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              This is the dedicated workspace for laboratory technicians. Here you can access 
              laboratory equipment, manage testing protocols, and coordinate with the research team.
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-purple-50 rounded-lg p-6">
                <FlaskConical className="mx-auto mb-4 text-purple-600" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Laboratory Testing</h3>
                <p className="text-gray-600 text-sm">
                  Conduct comprehensive laboratory tests and analysis for various service requests
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <Hammer className="mx-auto mb-4 text-blue-600" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipment Management</h3>
                <p className="text-gray-600 text-sm">
                  Monitor and maintain laboratory equipment to ensure optimal performance
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <Settings className="mx-auto mb-4 text-green-600" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Control</h3>
                <p className="text-gray-600 text-sm">
                  Implement quality control measures and ensure compliance with standards
                </p>
              </div>
            </div>

            {/* Status Information */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">All systems operational</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Equipment Status</h4>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Equipment ready for use</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Message */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Advanced laboratory management features are currently under development. 
                Additional functionality will be available in future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}