// =====================================================
// CONSTANTS AND MOCK DATA FOR HOSPITAL MANAGEMENT SYSTEM
// =====================================================

import {
  Patient,
  Doctor,
  Appointment,
  DashboardStats,
  DoctorAvailability,
  DayOfWeek,
  PatientDemographics,
  MonthlyPatientData,
  DepartmentStats,
  BloodType,
} from './types';

// Helper to generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Format date helper
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time helper
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Calculate age from DOB
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Blood type options
export const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Days of week
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// Time slots for appointments
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
];

// Specializations with icons
export const SPECIALIZATIONS = [
  { name: 'Cardiology', icon: '❤️' },
  { name: 'Neurology', icon: '🧠' },
  { name: 'Orthopedics', icon: '🦴' },
  { name: 'Pediatrics', icon: '👶' },
  { name: 'Dermatology', icon: '🧴' },
  { name: 'Oncology', icon: '🎗️' },
  { name: 'Psychiatry', icon: '🧠' },
  { name: 'General Medicine', icon: '💊' },
  { name: 'Surgery', icon: '🔪' },
  { name: 'Gynecology', icon: '👩' },
  { name: 'ENT', icon: '👂' },
  { name: 'Ophthalmology', icon: '👁️' },
];

// Default doctor availability
const getDefaultAvailability = (): DoctorAvailability[] => {
  return DAYS_OF_WEEK.map((day) => ({
    dayOfWeek: day,
    startTime: day === 'saturday' || day === 'sunday' ? '09:00' : '08:00',
    endTime: day === 'saturday' || day === 'sunday' ? '13:00' : '17:00',
    isAvailable: day !== 'sunday',
  }));
};

// Mock Patients Data
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    bloodType: 'A+',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    address: '123 Main Street, New York, NY 10001',
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '(555) 123-4568',
    },
    medicalHistory: [
      { condition: 'Hypertension', diagnosedDate: '2020-01-10', status: 'chronic' },
      { condition: 'Type 2 Diabetes', diagnosedDate: '2019-06-20', status: 'active' },
    ],
    allergies: ['Penicillin', 'Sulfa'],
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS-123456789',
      groupNumber: 'GRP-001',
      validUntil: '2025-12-31',
    },
    status: 'active',
    registeredDate: '2019-01-15',
    lastVisit: '2024-01-10',
  },
  {
    id: 'pat-002',
    firstName: 'Emily',
    lastName: 'Johnson',
    dateOfBirth: '1990-07-22',
    gender: 'female',
    bloodType: 'B+',
    phone: '(555) 234-5678',
    email: 'emily.johnson@email.com',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    emergencyContact: {
      name: 'Robert Johnson',
      relationship: 'Father',
      phone: '(555) 234-5679',
    },
    medicalHistory: [
      { condition: 'Asthma', diagnosedDate: '2015-03-12', status: 'chronic' },
    ],
    allergies: ['Dust', 'Pollen'],
    insurance: {
      provider: 'Aetna',
      policyNumber: 'AET-987654321',
      groupNumber: 'GRP-002',
      validUntil: '2024-06-30',
    },
    status: 'admitted',
    registeredDate: '2020-05-20',
    lastVisit: '2024-01-12',
  },
  {
    id: 'pat-003',
    firstName: 'Michael',
    lastName: 'Williams',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    bloodType: 'O+',
    phone: '(555) 345-6789',
    email: 'michael.williams@email.com',
    address: '789 Pine Road, Chicago, IL 60601',
    emergencyContact: {
      name: 'Sarah Williams',
      relationship: 'Wife',
      phone: '(555) 345-6790',
    },
    medicalHistory: [
      { condition: 'Coronary Artery Disease', diagnosedDate: '2022-08-15', status: 'active' },
      { condition: 'High Cholesterol', diagnosedDate: '2021-02-10', status: 'chronic' },
    ],
    allergies: [],
    insurance: {
      provider: 'United Healthcare',
      policyNumber: 'UHC-456789123',
      groupNumber: 'GRP-003',
      validUntil: '2025-03-31',
    },
    status: 'critical',
    registeredDate: '2021-01-10',
    lastVisit: '2024-01-11',
  },
  {
    id: 'pat-004',
    firstName: 'Sarah',
    lastName: 'Brown',
    dateOfBirth: '1995-04-18',
    gender: 'female',
    bloodType: 'AB+',
    phone: '(555) 456-7890',
    email: 'sarah.brown@email.com',
    address: '321 Elm Street, Houston, TX 77001',
    emergencyContact: {
      name: 'David Brown',
      relationship: 'Brother',
      phone: '(555) 456-7891',
    },
    medicalHistory: [],
    allergies: ['Latex'],
    insurance: {
      provider: 'Cigna',
      policyNumber: 'CIG-789123456',
      groupNumber: 'GRP-004',
      validUntil: '2024-09-30',
    },
    status: 'active',
    registeredDate: '2023-03-15',
    lastVisit: '2024-01-08',
  },
  {
    id: 'pat-005',
    firstName: 'James',
    lastName: 'Davis',
    dateOfBirth: '1968-09-05',
    gender: 'male',
    bloodType: 'A-',
    phone: '(555) 567-8901',
    email: 'james.davis@email.com',
    address: '654 Maple Lane, Phoenix, AZ 85001',
    emergencyContact: {
      name: 'Linda Davis',
      relationship: 'Wife',
      phone: '(555) 567-8902',
    },
    medicalHistory: [
      { condition: 'Arthritis', diagnosedDate: '2018-11-20', status: 'chronic' },
      { condition: 'Hypertension', diagnosedDate: '2017-05-15', status: 'active' },
    ],
    allergies: ['Aspirin'],
    insurance: {
      provider: 'Humana',
      policyNumber: 'HUM-321654987',
      groupNumber: 'GRP-005',
      validUntil: '2024-12-31',
    },
    status: 'discharged',
    registeredDate: '2017-06-01',
    lastVisit: '2024-01-05',
  },
  {
    id: 'pat-006',
    firstName: 'Lisa',
    lastName: 'Martinez',
    dateOfBirth: '1982-12-12',
    gender: 'female',
    bloodType: 'B-',
    phone: '(555) 678-9012',
    email: 'lisa.martinez@email.com',
    address: '987 Cedar Drive, Miami, FL 33101',
    emergencyContact: {
      name: 'Carlos Martinez',
      relationship: 'Husband',
      phone: '(555) 678-9013',
    },
    medicalHistory: [
      { condition: 'Migraine', diagnosedDate: '2019-04-10', status: 'chronic' },
    ],
    allergies: ['Codeine', 'Ibuprofen'],
    insurance: {
      provider: 'Kaiser Permanente',
      policyNumber: 'KP-654987321',
      groupNumber: 'GRP-006',
      validUntil: '2025-06-30',
    },
    status: 'active',
    registeredDate: '2019-05-15',
    lastVisit: '2024-01-09',
  },
];

// Mock Doctors Data
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    firstName: 'Robert',
    lastName: 'Chen',
    specialization: 'Cardiology',
    licenseNumber: 'MD-123456',
    phone: '(555) 111-2222',
    email: 'r.chen@hospital.com',
    department: 'Cardiology',
    status: 'available',
    consultationFee: 250,
    education: ['MD - Harvard Medical School', 'Fellowship - Johns Hopkins'],
    experience: 15,
    availability: getDefaultAvailability(),
    rating: 4.9,
    totalPatients: 1250,
  },
  {
    id: 'doc-002',
    firstName: 'Jennifer',
    lastName: 'Williams',
    specialization: 'Neurology',
    licenseNumber: 'MD-234567',
    phone: '(555) 222-3333',
    email: 'j.williams@hospital.com',
    department: 'Neurology',
    status: 'busy',
    consultationFee: 300,
    education: ['MD - Stanford Medical School', 'Residency - UCSF'],
    experience: 12,
    availability: getDefaultAvailability(),
    rating: 4.8,
    totalPatients: 890,
  },
  {
    id: 'doc-003',
    firstName: 'David',
    lastName: 'Kumar',
    specialization: 'Orthopedics',
    licenseNumber: 'MD-345678',
    phone: '(555) 333-4444',
    email: 'd.kumar@hospital.com',
    department: 'Orthopedics',
    status: 'available',
    consultationFee: 200,
    education: ['MD - Yale School of Medicine', 'Fellowship - Mayo Clinic'],
    experience: 10,
    availability: getDefaultAvailability(),
    rating: 4.7,
    totalPatients: 1100,
  },
  {
    id: 'doc-004',
    firstName: 'Amanda',
    lastName: 'Taylor',
    specialization: 'Pediatrics',
    licenseNumber: 'MD-456789',
    phone: '(555) 444-5555',
    email: 'a.taylor@hospital.com',
    department: 'Pediatrics',
    status: 'available',
    consultationFee: 150,
    education: ['MD - Columbia University', 'Residency - Boston Children\'s Hospital'],
    experience: 8,
    availability: getDefaultAvailability(),
    rating: 4.9,
    totalPatients: 1500,
  },
  {
    id: 'doc-005',
    firstName: 'Michael',
    lastName: 'Johnson',
    specialization: 'Dermatology',
    licenseNumber: 'MD-567890',
    phone: '(555) 555-6666',
    email: 'm.johnson@hospital.com',
    department: 'Dermatology',
    status: 'off-duty',
    consultationFee: 180,
    education: ['MD - UCLA Medical School', 'Fellowship - NYU Langone'],
    experience: 6,
    availability: getDefaultAvailability(),
    rating: 4.6,
    totalPatients: 750,
  },
  {
    id: 'doc-006',
    firstName: 'Sarah',
    lastName: 'Anderson',
    specialization: 'General Medicine',
    licenseNumber: 'MD-678901',
    phone: '(555) 666-7777',
    email: 's.anderson@hospital.com',
    department: 'General Medicine',
    status: 'available',
    consultationFee: 120,
    education: ['MD - University of Michigan', 'Residency - Cleveland Clinic'],
    experience: 5,
    availability: getDefaultAvailability(),
    rating: 4.5,
    totalPatients: 2000,
  },
];

// Mock Appointments Data
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pat-001',
    patientName: 'John Smith',
    doctorId: 'doc-001',
    doctorName: 'Dr. Robert Chen',
    specialization: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'follow-up',
    status: 'confirmed',
    reason: 'Regular checkup for hypertension',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'apt-002',
    patientId: 'pat-002',
    patientName: 'Emily Johnson',
    doctorId: 'doc-004',
    doctorName: 'Dr. Amanda Taylor',
    specialization: 'Pediatrics',
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    reason: 'Respiratory infection follow-up',
    createdAt: '2024-01-06T14:00:00Z',
  },
  {
    id: 'apt-003',
    patientId: 'pat-003',
    patientName: 'Michael Williams',
    doctorId: 'doc-001',
    doctorName: 'Dr. Robert Chen',
    specialization: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 45,
    type: 'emergency',
    status: 'in-progress',
    reason: 'Chest pain evaluation',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'apt-004',
    patientId: 'pat-004',
    patientName: 'Sarah Brown',
    doctorId: 'doc-005',
    doctorName: 'Dr. Michael Johnson',
    specialization: 'Dermatology',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    reason: 'Skin rash examination',
    createdAt: '2024-01-08T09:00:00Z',
  },
  {
    id: 'apt-005',
    patientId: 'pat-005',
    patientName: 'James Davis',
    doctorId: 'doc-003',
    doctorName: 'Dr. David Kumar',
    specialization: 'Orthopedics',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '15:30',
    duration: 30,
    type: 'follow-up',
    status: 'confirmed',
    reason: 'Knee pain follow-up',
    createdAt: '2024-01-07T11:00:00Z',
  },
  {
    id: 'apt-006',
    patientId: 'pat-006',
    patientName: 'Lisa Martinez',
    doctorId: 'doc-002',
    doctorName: 'Dr. Jennifer Williams',
    specialization: 'Neurology',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '09:30',
    duration: 45,
    type: 'follow-up',
    status: 'scheduled',
    reason: 'Migraine treatment review',
    createdAt: '2024-01-09T16:00:00Z',
  },
];

// Dashboard Statistics
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalPatients: 2456,
  totalDoctors: 48,
  todayAppointments: 32,
  pendingAppointments: 18,
  admittedPatients: 24,
  criticalPatients: 3,
  revenue: 158500,
  bedOccupancy: 78,
};

// Patient Demographics for Charts
export const PATIENT_DEMOGRAPHICS: PatientDemographics[] = [
  { ageGroup: '0-18', male: 150, female: 140 },
  { ageGroup: '19-30', male: 280, female: 320 },
  { ageGroup: '31-45', male: 350, female: 380 },
  { ageGroup: '46-60', male: 420, female: 390 },
  { ageGroup: '61+', male: 280, female: 310 },
];

// Monthly Patient Data
export const MONTHLY_PATIENT_DATA: MonthlyPatientData[] = [
  { month: 'Jan', newPatients: 120, returning: 450, total: 570 },
  { month: 'Feb', newPatients: 135, returning: 480, total: 615 },
  { month: 'Mar', newPatients: 142, returning: 510, total: 652 },
  { month: 'Apr', newPatients: 128, returning: 495, total: 623 },
  { month: 'May', newPatients: 155, returning: 530, total: 685 },
  { month: 'Jun', newPatients: 168, returning: 560, total: 728 },
  { month: 'Jul', newPatients: 175, returning: 585, total: 760 },
  { month: 'Aug', newPatients: 162, returning: 570, total: 732 },
  { month: 'Sep', newPatients: 158, returning: 545, total: 703 },
  { month: 'Oct', newPatients: 180, returning: 590, total: 770 },
  { month: 'Nov', newPatients: 195, returning: 620, total: 815 },
  { month: 'Dec', newPatients: 185, returning: 605, total: 790 },
];

// Department Statistics
export const DEPARTMENT_STATS: DepartmentStats[] = [
  { department: 'Cardiology', patients: 450, revenue: 125000, doctors: 8 },
  { department: 'Neurology', patients: 320, revenue: 98000, doctors: 6 },
  { department: 'Orthopedics', patients: 380, revenue: 110000, doctors: 7 },
  { department: 'Pediatrics', patients: 520, revenue: 85000, doctors: 10 },
  { department: 'General Medicine', patients: 780, revenue: 150000, doctors: 12 },
  { department: 'Dermatology', patients: 280, revenue: 65000, doctors: 5 },
];

// Status colors
export const STATUS_COLORS = {
  patient: {
    active: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    admitted: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    discharged: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  },
  appointment: {
    scheduled: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    confirmed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    'in-progress': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    completed: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
    cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    'no-show': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  },
  doctor: {
    available: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    busy: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    'off-duty': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
    'on-leave': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  },
};
