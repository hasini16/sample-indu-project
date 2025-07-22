import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import type { User, CSC, Technician, FormData, ServiceRequestFormData } from '../types';

// Configure LocalForage stores
const usersStore = localforage.createInstance({
  name: 'AppDB',
  storeName: 'users'
});

const cscStore = localforage.createInstance({
  name: 'AppDB',
  storeName: 'csc'
});

const techniciansStore = localforage.createInstance({
  name: 'AppDB',
  storeName: 'technicians'
});

const formsStore = localforage.createInstance({
  name: 'AppDB',
  storeName: 'forms'
});

const serviceRequestsStore = localforage.createInstance({
  name: 'AppDB',
  storeName: 'serviceRequests'
});

class DatabaseService {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date()
    };
    await usersStore.setItem(user.id, user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.username === username) || null;
  }

  async getAllUsers(): Promise<User[]> {
    const users: User[] = [];
    await usersStore.iterate((value: User) => {
      users.push(value);
    });
    return users;
  }

  // CSC operations
  async createCSC(cscData: Omit<CSC, 'id' | 'createdAt'>): Promise<CSC> {
    const csc: CSC = {
      ...cscData,
      id: uuidv4(),
      createdAt: new Date()
    };
    await cscStore.setItem(csc.id, csc);
    return csc;
  }

  async getCSCByUsername(username: string): Promise<CSC | null> {
    const cscs = await this.getAllCSCs();
    return cscs.find(csc => csc.username === username) || null;
  }

  async getAllCSCs(): Promise<CSC[]> {
    const cscs: CSC[] = [];
    await cscStore.iterate((value: CSC) => {
      cscs.push(value);
    });
    return cscs;
  }

  // Technician operations
  async createTechnician(techData: Omit<Technician, 'id' | 'createdAt'>): Promise<Technician> {
    const technician: Technician = {
      ...techData,
      id: uuidv4(),
      createdAt: new Date()
    };
    await techniciansStore.setItem(technician.id, technician);
    return technician;
  }

  async getTechnicianByUsername(username: string): Promise<Technician | null> {
    const technicians = await this.getAllTechnicians();
    return technicians.find(tech => tech.username === username) || null;
  }

  async getAllTechnicians(): Promise<Technician[]> {
    const technicians: Technician[] = [];
    await techniciansStore.iterate((value: Technician) => {
      technicians.push(value);
    });
    return technicians;
  }

  // Form operations
  async createForm(formData: Omit<FormData, 'id' | 'submissionTime'>): Promise<FormData> {
    const form: FormData = {
      ...formData,
      id: uuidv4(),
      submissionTime: new Date()
    };
    await formsStore.setItem(form.id, form);
    return form;
  }

  async getFormById(id: string): Promise<FormData | null> {
    return await formsStore.getItem(id);
  }

  async getFormsByUserId(userId: string): Promise<FormData[]> {
    const forms: FormData[] = [];
    await formsStore.iterate((value: FormData) => {
      if (value.userId === userId) {
        forms.push(value);
      }
    });
    return forms.sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime());
  }

  async getAllForms(): Promise<FormData[]> {
    const forms: FormData[] = [];
    await formsStore.iterate((value: FormData) => {
      forms.push(value);
    });
    return forms.sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime());
  }

  async updateForm(id: string, updates: Partial<FormData>): Promise<FormData | null> {
    const existingForm = await this.getFormById(id);
    if (!existingForm) return null;

    const updatedForm = { ...existingForm, ...updates };
    await formsStore.setItem(id, updatedForm);
    return updatedForm;
  }

  async deleteForm(id: string): Promise<boolean> {
    try {
      await formsStore.removeItem(id);
      return true;
    } catch {
      return false;
    }
  }

  // Service Request operations
  async createServiceRequest(serviceRequestData: Omit<ServiceRequestFormData, 'id' | 'submissionTime'>): Promise<ServiceRequestFormData> {
    const serviceRequest: ServiceRequestFormData = {
      ...serviceRequestData,
      id: uuidv4(),
      submissionTime: new Date(),
      serviceRequestNo: serviceRequestData.serviceRequestNo || `SR-${Date.now()}`
    };
    await serviceRequestsStore.setItem(serviceRequest.id, serviceRequest);
    return serviceRequest;
  }

  async getServiceRequestById(id: string): Promise<ServiceRequestFormData | null> {
    return await serviceRequestsStore.getItem(id);
  }

  async getServiceRequestsByUserId(userId: string): Promise<ServiceRequestFormData[]> {
    const serviceRequests: ServiceRequestFormData[] = [];
    await serviceRequestsStore.iterate((value: ServiceRequestFormData) => {
      if (value.userId === userId) {
        serviceRequests.push(value);
      }
    });
    return serviceRequests.sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime());
  }

  async getAllServiceRequests(): Promise<ServiceRequestFormData[]> {
    const serviceRequests: ServiceRequestFormData[] = [];
    await serviceRequestsStore.iterate((value: ServiceRequestFormData) => {
      serviceRequests.push(value);
    });
    return serviceRequests.sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime());
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequestFormData>): Promise<ServiceRequestFormData | null> {
    const existingServiceRequest = await this.getServiceRequestById(id);
    if (!existingServiceRequest) return null;

    const updatedServiceRequest = { ...existingServiceRequest, ...updates };
    await serviceRequestsStore.setItem(id, updatedServiceRequest);
    return updatedServiceRequest;
  }

  async deleteServiceRequest(id: string): Promise<boolean> {
    try {
      await serviceRequestsStore.removeItem(id);
      return true;
    } catch {
      return false;
    }
  }

  // Initialize with default data
  async initializeDefaultData(): Promise<void> {
    // Check if data already exists
    const users = await this.getAllUsers();
    const cscs = await this.getAllCSCs();
    const technicians = await this.getAllTechnicians();

    // Create default CSC user if none exist
    if (cscs.length === 0) {
      await this.createCSC({
        username: 'csc_admin',
        password: 'admin123',
        email: 'csc@company.com',
        firstName: 'CSC',
        lastName: 'Administrator'
      });
    }

    // Create default technician if none exist
    if (technicians.length === 0) {
      await this.createTechnician({
        username: 'tech_admin',
        password: 'tech123',
        email: 'tech@company.com',
        firstName: 'Lab',
        lastName: 'Technician'
      });
    }

    // Create a test user if none exist
    if (users.length === 0) {
      await this.createUser({
        username: 'testuser',
        password: 'test123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      });
    }
  }
}

export const db = new DatabaseService();