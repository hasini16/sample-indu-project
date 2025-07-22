import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, CSC, Technician, AuthContextType, UserType } from '../types';
import { db } from '../services/database';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | CSC | Technician | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    // Initialize database with default data
    db.initializeDefaultData();
    
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType as UserType);
    }
  }, []);

  const login = async (username: string, password: string, type: UserType): Promise<boolean> => {
    try {
      let foundUser: User | CSC | Technician | null = null;

      switch (type) {
        case 'user':
          foundUser = await db.getUserByUsername(username);
          break;
        case 'csc':
          foundUser = await db.getCSCByUsername(username);
          break;
        case 'technician':
          foundUser = await db.getTechnicianByUsername(username);
          break;
      }

      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        setUserType(type);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        localStorage.setItem('userType', type);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Check if username already exists
      const existingUser = await db.getUserByUsername(userData.username);
      if (existingUser) {
        return false;
      }

      const newUser = await db.createUser(userData);
      setUser(newUser);
      setUserType('user');
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('userType', 'user');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    login,
    logout,
    signup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}