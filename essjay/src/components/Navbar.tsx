import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, User, Settings, Home, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Navbar({ showBackButton = false, onBack }: NavbarProps) {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'user':
        return 'User';
      case 'csc':
        return 'CSC Admin';
      case 'technician':
        return 'Technician';
      default:
        return 'Guest';
    }
  };

  const getUserTypeColor = () => {
    switch (userType) {
      case 'user':
        return 'bg-blue-500 text-blue-100';
      case 'csc':
        return 'bg-green-500 text-green-100';
      case 'technician':
        return 'bg-purple-500 text-purple-100';
      default:
        return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side */}
          <div className="flex items-center space-x-6">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all duration-200 bg-white/5 border border-white/10"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/15 p-2 rounded-xl">
                <Home size={28} className="text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  EssJay Portal
                </span>
                <div className="text-xs text-blue-100 font-medium">Service Management System</div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Dashboard link */}
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all duration-200 bg-white/5 border border-white/10"
                >
                  <Settings size={18} />
                  <span>Dashboard</span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-sm font-bold">
                        {getUserInitials()}
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="text-sm font-semibold">{getUserDisplayName()}</div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${getUserTypeColor()}`}>
                          {getUserTypeLabel()}
                        </div>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`transform transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold text-white">
                            {getUserInitials()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</div>
                            <div className="text-xs text-gray-500">{getUserTypeLabel()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigate(getDashboardPath());
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={16} />
                        <span>Go to Dashboard</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all duration-200 bg-white/5 border border-white/10"
                >
                  <Home size={18} />
                  <span>Home</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}