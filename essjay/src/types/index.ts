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

// Complete Service Request Form Data based on the images
export interface ServiceRequestFormData {
  id: string;
  userId: string;
  submissionTime: Date;
  status: 'submitted' | 're-submitted' | 'under process' | 'action needed' | 'completed';
  
  // Service Request Details
  serviceRequestNo: string;
  date: string;
  workOrderNo: string;
  
  // Customer/Organization Details
  organizationName: string;
  organizationAddress: string;
  contactPerson: string;
  phoneNo: string;
  faxNo: string;
  mobileNo: string;
  emailId: string;
  
  // Calibration Details
  calibrationService: 'atLaboratory' | 'atSite';
  calibrationRequestDate: string;
  targetDeliveryDate: string;
  frequencyOfCalibration: string;
  
  // Instrument Condition
  instrumentCondition: 'ok' | 'notOk';
  
  // Calibration Method
  calibrationMethod: 'asPerWorkInstruction' | 'asPerScopeOfAccreditation' | 'inAppropriate' | 'outOfDate';
  
  // NABL Parameters
  parameterUnderNABL: boolean;
  statementOfConformity: boolean;
  
  // Pass/Fail Criteria
  obsReading: string;
  muValue: string;
  uslValue: string;
  lslValue: string;
  
  // Additional Questions
  differenceWithContactTender: boolean;
  differenceResolved: boolean;
  contactAccepted: boolean;
  deviationFromContract: boolean;
  deviationDetails: string;
  contractAmended: boolean;
  contractReviewRepeated: boolean;
  amendedContractCommunicated: boolean;
  clarificationAsked: boolean;
  witnessAsked: boolean;
  witnessActivity: string[];
  
  // Terms and Conditions
  priceAsPerPriceList: string;
  paymentTerms: string;
  deliveryMode: string;
  agreedDeliveryDateInstrument: string;
  agreedDeliveryDateCertificate: string;
  manualProvided: boolean;
  instrumentList: string;
  
  // Signatures
  customerSignature: string;
  overallRemarks: string;
  
  // CSC Only Fields
  cscRemarks?: string; // Only visible and editable by CSC
  cscInternalNotes?: string; // CSC internal tracking
}

// For backward compatibility, keep the old FormData interface
export interface FormData {
  id: string;
  userId: string;
  submissionTime: Date;
  status: 'submitted' | 're-submitted' | 'under process' | 'action needed' | 'completed';
  comments: string;
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