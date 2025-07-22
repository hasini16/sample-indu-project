import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { UserDashboard } from './pages/UserDashboard';
import { CreateFormPage } from './pages/CreateFormPage';
import { CSCDashboard } from './pages/CSCDashboard';
import { EditFormPage } from './pages/EditFormPage';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login/:type" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* User Routes */}
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/create-form" element={<CreateFormPage />} />
            
            {/* CSC Routes */}
            <Route path="/csc-dashboard" element={<CSCDashboard />} />
            <Route path="/edit-form/:formId" element={<EditFormPage />} />
            
            {/* Technician Routes */}
            <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
