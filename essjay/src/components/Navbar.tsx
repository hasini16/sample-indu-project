import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, User, Settings, Home } from 'lucide-react';

interface NavbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Navbar({ showBackButton = false, onBack }: NavbarProps) {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const getDashboardPath = () => {
    switch (userType) {
      case 'user':
        return '/user-dashboard';
      case 'csc':
        return '/csc-dashboard';
      case 'technician':
        return '/technician-dashboard';
      default:
        return '/';
    }
  };

  const getUserDisplayName = () => {
    if (user && 'firstName' in user && user.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    return user?.username || 'User';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <Home size={24} />
              <span className="text-xl font-bold">Company Portal</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center space-x-2">
                  <User size={20} />
                  <span className="text-sm font-medium">{getUserDisplayName()}</span>
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded-full capitalize">
                    {userType}
                  </span>
                </div>

                {/* Dashboard link */}
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Settings size={16} />
                  <span>Dashboard</span>
                </button>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors bg-red-500"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}