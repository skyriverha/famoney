// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Ledger types
export interface Ledger {
  id: string;
  name: string;
  description: string;
  currency: string;
  memberCount: number;
  monthlyTotal: number;
  lastUpdated: string;
  members: Member[];
  expenses: Expense[];
}

// Member types
export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  joinedDate: string;
  invitedBy: string;
}

// Expense types
export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
  paymentMethod?: string;
  createdBy: string;
  createdByName: string;
  createdByAvatar?: string;
  receipt?: string;
}

// Category types
export type Category = 
  | '식비'
  | '교통비'
  | '생활용품'
  | '공과금'
  | '의료비'
  | '문화/여가'
  | '기타';

// Category colors mapping
export const CATEGORY_COLORS: Record<Category, string> = {
  '식비': '#ef4444',
  '교통비': '#3b82f6',
  '생활용품': '#10b981',
  '공과금': '#f59e0b',
  '의료비': '#ec4899',
  '문화/여가': '#8b5cf6',
  '기타': '#6b7280',
};

