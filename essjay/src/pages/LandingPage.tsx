import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Users, Shield, Wrench, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const loginOptions = [
    {
      type: 'user',
      title: 'Users',
      description: 'Submit and track your service requests',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      route: '/login/user'
    },
    {
      type: 'csc',
      title: 'CSC',
      description: 'Customer Service Center - Manage user requests',
      icon: Shield,
      color: 'bg-green-500 hover:bg-green-600',
      route: '/login/csc'
    },
    {
      type: 'technician',
      title: 'Lab Technician',
      description: 'Technical support and laboratory services',
      icon: Wrench,
      color: 'bg-purple-500 hover:bg-purple-600',
      route: '/login/technician'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Company Portal
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your comprehensive solution for service requests, customer support, and laboratory services
            </p>
          </div>
        </div>
      </div>

      {/* Login Options Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Portal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the appropriate login option based on your role in our organization
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loginOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.type}
                className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-6 transition-colors`}>
                  <IconComponent size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {option.description}
                </p>
                <button
                  onClick={() => navigate(option.route)}
                  className={`w-full ${option.color} text-white py-3 px-6 rounded-lg font-semibold transition-colors`}
                >
                  Login as {option.title}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Company Information Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About Our Company
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We are a leading provider of comprehensive business solutions, offering 
                  exceptional customer service and cutting-edge laboratory services to meet 
                  your needs.
                </p>
                <p>
                  Our platform streamlines the process of submitting service requests, 
                  tracking progress, and ensuring quality delivery through our dedicated 
                  Customer Service Center and laboratory technicians.
                </p>
                <p>
                  With years of experience in the industry, we pride ourselves on delivering 
                  reliable, efficient, and professional services to all our clients.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Services
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Comprehensive service request management
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  24/7 customer support center
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Advanced laboratory testing and analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Real-time status tracking and updates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Professional consultation services
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Quality assurance and compliance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Company Portal</h3>
              <p className="text-gray-400 mb-4">
                Providing exceptional service solutions and laboratory expertise 
                to help your business thrive in today's competitive market.
              </p>
              <div className="flex space-x-4">
                <Facebook size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin size={24} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Mail size={16} className="mr-3" />
                  <span>info@company.com</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-3" />
                  <span>123 Business St, City, State 12345</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer transition-colors">About Us</div>
                <div className="hover:text-white cursor-pointer transition-colors">Services</div>
                <div className="hover:text-white cursor-pointer transition-colors">Support</div>
                <div className="hover:text-white cursor-pointer transition-colors">Privacy Policy</div>
                <div className="hover:text-white cursor-pointer transition-colors">Terms of Service</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Company Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}