// =====================================================
// TYPE DEFINITIONS FOR HOSPITAL MANAGEMENT SYSTEM
// =====================================================

// Patient Types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: BloodType;
  phone: string;
  email: string;
  address: string;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalCondition[];
  allergies: string[];
  insurance: InsuranceInfo;
  status: PatientStatus;
  avatar?: string;
  registeredDate: string;
  lastVisit: string;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type PatientStatus = 'active' | 'admitted' | 'discharged' | 'critical';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalCondition {
  condition: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'chronic';
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  validUntil: string;
}

// Doctor Types
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: Specialization;
  licenseNumber: string;
  phone: string;
  email: string;
  avatar?: string;
  department: string;
  status: DoctorStatus;
  consultationFee: number;
  education: string[];
  experience: number; // years
  availability: DoctorAvailability[];
  rating: number;
  totalPatients: number;
}

export type Specialization = 
  | 'Cardiology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Oncology'
  | 'Psychiatry'
  | 'General Medicine'
  | 'Surgery'
  | 'Gynecology'
  | 'ENT'
  | 'Ophthalmology';

export type DoctorStatus = 'available' | 'busy' | 'off-duty' | 'on-leave';

export interface DoctorAvailability {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: Specialization;
  date: string;
  time: string;
  duration: number; // in minutes
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: string;
}

export type AppointmentType = 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup' | 'surgery';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

// Dashboard Statistics
export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  pendingAppointments: number;
  admittedPatients: number;
  criticalPatients: number;
  revenue: number;
  bedOccupancy: number;
}

// Chart Data Types
export interface PatientDemographics {
  ageGroup: string;
  male: number;
  female: number;
}

export interface MonthlyPatientData {
  month: string;
  newPatients: number;
  returning: number;
  total: number;
}

export interface DepartmentStats {
  department: string;
  patients: number;
  revenue: number;
  doctors: number;
}

// Filter Types
export interface PatientFilter {
  search: string;
  status: PatientStatus | 'all';
  bloodType: BloodType | 'all';
  gender: 'male' | 'female' | 'other' | 'all';
  dateRange: {
    start: string;
    end: string;
  };
}

export interface AppointmentFilter {
  search: string;
  status: AppointmentStatus | 'all';
  type: AppointmentType | 'all';
  doctorId: string | 'all';
  dateRange: {
    start: string;
    end: string;
  };
}

// Form Types
export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: BloodType;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  allergies: string;
  insuranceProvider: string;
  policyNumber: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: AppointmentType;
  reason: string;
  notes?: string;
}

// Navigation Types
export type NavView = 'dashboard' | 'patients' | 'appointments' | 'doctors' | 'reports';

// Time slots for appointments
export interface TimeSlot {
  time: string;
  available: boolean;
  doctorId?: string;
}
