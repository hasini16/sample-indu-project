import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Settings, Home, ChevronDown } from 'lucide-react';
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
        return { backgroundColor: 'var(--color-blue-500)', color: 'var(--color-blue-100)' };
      case 'csc':
        return { backgroundColor: 'var(--color-green-500)', color: 'var(--color-green-100)' };
      case 'technician':
        return { backgroundColor: 'var(--color-purple-500)', color: 'var(--color-purple-100)' };
      default:
        return { backgroundColor: 'var(--color-gray-500)', color: 'var(--color-gray-100)' };
    }
  };

  return (
    <nav className="text-white shadow-xl border-b" style={{ 
      background: 'linear-gradient(to right, var(--color-blue-600), var(--color-blue-700), #4338ca)',
      borderBottomColor: 'rgba(59, 130, 246, 0.2)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ height: '5rem' }}>
          {/* Left side */}
          <div className="flex items-center space-x-6">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <Home size={28} className="text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">
                  EssJay Portal
                </span>
                <div className="text-xs font-medium" style={{ color: 'var(--color-blue-100)' }}>
                  Service Management System
                </div>
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
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <Settings size={18} />
                  <span>Dashboard</span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                          background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'
                        }}
                      >
                        {getUserInitials()}
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="text-sm font-semibold">{getUserDisplayName()}</div>
                        <div 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            ...getUserTypeColor(),
                            fontSize: '0.75rem',
                            lineHeight: '1rem'
                          }}
                        >
                          {getUserTypeLabel()}
                        </div>
                      </div>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className="transition-transform"
                      style={{ 
                        transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div 
                      className="absolute right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      style={{ 
                        marginTop: '0.5rem',
                        width: '14rem'
                      }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                            style={{
                              background: 'linear-gradient(to bottom right, var(--color-blue-500), #4f46e5)'
                            }}
                          >
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
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors"
                        style={{ color: 'var(--color-red-600)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-red-50)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
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
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
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