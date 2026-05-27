// Data types for the employee dataset

export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;        // ISO date string "YYYY-MM-DD"
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string;      // ISO date string
  performanceRating: number;
}

// Column definition for the table
export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => import('react').ReactNode;
  sortable?: boolean;
}
