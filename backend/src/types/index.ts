import { Request } from 'express';

// User Types
export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  restaurantId?: string;
  profile: IUserProfile;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  position: string;
  permissions: string[];
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
}

// Restaurant Types
export interface IRestaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  settings: IRestaurantSettings;
  subscription: ISubscription;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRestaurantSettings {
  currency: string;
  timezone: string;
  taxRate: number;
  serviceCharge: number;
  workingHours: IWorkingHours;
  features: string[];
}

export interface IWorkingHours {
  [day: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

export interface ISubscription {
  plan: string;
  status: 'active' | 'inactive' | 'expired';
  startDate: Date;
  endDate: Date;
  features: string[];
}

// Table Types
export interface ITable {
  id: string;
  restaurantId: string;
  number: number;
  capacity: number;
  area: string;
  status: TableStatus;
  currentOrderId?: string;
  mergedWith?: string[];
  mergeType?: 'main' | 'secondary';
  mainTableId?: string;
  coordinates?: ICoordinates;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  MERGED = 'merged',
}

export interface ICoordinates {
  x: number;
  y: number;
}

// Menu Types
export interface IMenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  isAvailable: boolean;
  isVegetarian?: boolean;
  allergens?: string[];
  preparationTime?: number;
  image?: string;
  nutritionalInfo?: INutritionalInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface INutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

// Order Types
export interface IOrder {
  id: string;
  restaurantId: string;
  orderNumber: string;
  tableId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  servedBy: string;
  startTime: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  status: OrderItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderItemStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  DIGITAL = 'digital',
}

// Inventory Types
export interface IInventoryItem {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  cost: number;
  supplier?: ISupplier;
  expiryDate?: Date;
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupplier {
  name: string;
  contact: string;
  email?: string;
  address?: string;
}

// Staff Types
export interface IStaff {
  id: string;
  restaurantId: string;
  userId: string;
  employeeId: string;
  position: string;
  department: string;
  salary?: number;
  hourlyRate?: number;
  schedule: ISchedule;
  isActive: boolean;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISchedule {
  [day: string]: {
    startTime: string;
    endTime: string;
    isWorking: boolean;
  };
}

export interface IAttendance {
  id: string;
  staffId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breakDuration?: number;
  hoursWorked?: number;
  overtime?: number;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
}

// Expense Types
export interface IExpense {
  id: string;
  restaurantId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  paymentMethod: string;
  approvedBy?: string;
  receiptImage?: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ExpenseCategory {
  INVENTORY = 'inventory',
  UTILITIES = 'utilities',
  MAINTENANCE = 'maintenance',
  MARKETING = 'marketing',
  SALARY = 'salary',
  OTHER = 'other',
}

// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: IPagination;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Request Types
export interface AuthRequest extends Request {
  user?: IUser;
  restaurant?: IRestaurant;
}

// Query Types
export interface IQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
  filter?: Record<string, any>;
}

// JWT Types
export interface IJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
}

// Socket Types
export interface ISocketData {
  userId: string;
  restaurantId: string;
  role: UserRole;
}

export interface ISocketEvent {
  type: string;
  data: any;
  restaurantId: string;
  timestamp: Date;
}

export default {};
