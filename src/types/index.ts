export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'User' | 'Lab Technician' | 'Researcher' | 'Manufacturing Engineer';
  password: string;
  createdAt: string;
}

export interface Component {
  id: string;
  name: string;
  manufacturer: string;
  partNumber: string;
  description: string;
  quantity: number;
  location: string;
  unitPrice: number;
  datasheetLink: string;
  category: string;
  criticalLowThreshold: number;
  createdAt: string;
  lastOutwardDate?: string;
}

export interface Transaction {
  id: string;
  componentId: string;
  type: 'inward' | 'outward';
  quantity: number;
  userId: string;
  userName: string;
  reason: string;
  project?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'old_stock';
  componentId: string;
  componentName: string;
  message: string;
  timestamp: string;
  read: boolean;
}