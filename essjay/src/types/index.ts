export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

export interface CSC {
  id: string;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

export interface Technician {
  id: string;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

export interface FormData {
  id: string;
  userId: string;
  submissionTime: Date;
  status: 'submitted' | 're-submitted' | 'under process' | 'action needed' | 'completed';
  comments: string;
  // Form fields - you can customize these based on your requirements
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth?: string;
    idNumber?: string;
  };
  serviceDetails: {
    serviceType: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    attachments?: string[];
  };
  additionalInfo?: {
    notes?: string;
    preferences?: string;
  };
}

export interface AuthContextType {
  user: User | CSC | Technician | null;
  userType: 'user' | 'csc' | 'technician' | null;
  login: (username: string, password: string, type: 'user' | 'csc' | 'technician') => Promise<boolean>;
  logout: () => void;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
}

export type UserType = 'user' | 'csc' | 'technician';