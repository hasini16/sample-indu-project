import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Users, Shield, Wrench, Eye, EyeOff, LogIn } from 'lucide-react';
import type { UserType } from '../types';

export function LoginPage() {
  const { type } = useParams<{ type: UserType }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getConfig = () => {
    switch (type) {
      case 'user':
        return {
          title: 'User Login',
          icon: Users,
          color: 'blue',
          dashboardRoute: '/user-dashboard'
        };
      case 'csc':
        return {
          title: 'CSC Login',
          icon: Shield,
          color: 'green',
          dashboardRoute: '/csc-dashboard'
        };
      case 'technician':
        return {
          title: 'Lab Technician Login',
          icon: Wrench,
          color: 'purple',
          dashboardRoute: '/technician-dashboard'
        };
      default:
        return {
          title: 'Login',
          icon: Users,
          color: 'blue',
          dashboardRoute: '/'
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!type) {
      setError('Invalid login type');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.username, formData.password, type);
      
      if (success) {
        navigate(config.dashboardRoute);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultCredentials = () => {
    switch (type) {
      case 'user':
        return { username: 'testuser', password: 'test123' };
      case 'csc':
        return { username: 'csc_admin', password: 'admin123' };
      case 'technician':
        return { username: 'tech_admin', password: 'tech123' };
      default:
        return null;
    }
  };

  const defaultCreds = getDefaultCredentials();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showBackButton />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className={`w-16 h-16 bg-${config.color}-500 rounded-full flex items-center justify-center mx-auto mb-6`}>
              <IconComponent size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {config.title}
            </h2>
            <p className="text-gray-600">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Default credentials info */}
          {defaultCreds && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</h4>
              <p className="text-sm text-blue-800">
                Username: <code className="bg-blue-100 px-1 rounded">{defaultCreds.username}</code>
              </p>
              <p className="text-sm text-blue-800">
                Password: <code className="bg-blue-100 px-1 rounded">{defaultCreds.password}</code>
              </p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-${config.color}-600 hover:bg-${config.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <LogIn size={20} className="mr-2" />
              )}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {type === 'user' && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}