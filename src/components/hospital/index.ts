// =====================================================
// HOSPITAL MANAGEMENT SYSTEM - INDEX EXPORTS
// =====================================================

// Types
export * from './types';

// Constants
export * from './constants';

// Hooks
export {
  usePatients,
  useDoctors,
  useAppointments,
  useCalendar,
} from './useHospitalData';

// Components
export { default as HospitalDashboard } from './HospitalDashboard';
export { default as StatsCard } from './StatsCard';
export { default as PatientRecords } from './PatientRecords';
export { default as AppointmentCalendar } from './AppointmentCalendar';
export { default as DoctorAvailability } from './DoctorAvailability';
export { default as PatientCharts } from './PatientCharts';
export { default as PatientModal } from './PatientModal';
export { default as AppointmentModal } from './AppointmentModal';
export { default as Sidebar } from './Sidebar';
