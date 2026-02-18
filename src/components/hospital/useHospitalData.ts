// =====================================================
// CUSTOM HOOKS FOR HOSPITAL MANAGEMENT SYSTEM
// =====================================================

import { useState, useCallback, useMemo } from 'react';
import {
  Patient,
  Doctor,
  Appointment,
  PatientFilter,
  AppointmentFilter,
  PatientFormData,
  AppointmentFormData,
} from './types';
import {
  MOCK_PATIENTS,
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  generateId,
} from './constants';

// =====================================================
// USE PATIENTS HOOK
// =====================================================
interface UsePatientsReturn {
  patients: Patient[];
  filteredPatients: Patient[];
  filter: PatientFilter;
  setFilter: (filter: PatientFilter) => void;
  addPatient: (data: PatientFormData) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;
}

export const usePatients = (): UsePatientsReturn => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [filter, setFilter] = useState<PatientFilter>({
    search: '',
    status: 'all',
    bloodType: 'all',
    gender: 'all',
    dateRange: { start: '', end: '' },
  });

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch =
          patient.firstName.toLowerCase().includes(searchLower) ||
          patient.lastName.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower) ||
          patient.phone.includes(filter.search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filter.status !== 'all' && patient.status !== filter.status) {
        return false;
      }

      // Blood type filter
      if (filter.bloodType !== 'all' && patient.bloodType !== filter.bloodType) {
        return false;
      }

      // Gender filter
      if (filter.gender !== 'all' && patient.gender !== filter.gender) {
        return false;
      }

      return true;
    });
  }, [patients, filter]);

  // Add patient
  const addPatient = useCallback((data: PatientFormData): Patient => {
    const newPatient: Patient = {
      id: generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodType: data.bloodType,
      phone: data.phone,
      email: data.email,
      address: data.address,
      emergencyContact: {
        name: data.emergencyContactName,
        relationship: data.emergencyContactRelation,
        phone: data.emergencyContactPhone,
      },
      medicalHistory: [],
      allergies: data.allergies.split(',').map((a) => a.trim()).filter(Boolean),
      insurance: {
        provider: data.insuranceProvider,
        policyNumber: data.policyNumber,
        groupNumber: '',
        validUntil: '',
      },
      status: 'active',
      registeredDate: new Date().toISOString().split('T')[0],
      lastVisit: new Date().toISOString().split('T')[0],
    };

    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  }, []);

  // Update patient
  const updatePatient = useCallback((id: string, data: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, ...data } : patient
      )
    );
  }, []);

  // Delete patient
  const deletePatient = useCallback((id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  }, []);

  // Get patient by ID
  const getPatientById = useCallback(
    (id: string) => patients.find((patient) => patient.id === id),
    [patients]
  );

  return {
    patients,
    filteredPatients,
    filter,
    setFilter,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
  };
};

// =====================================================
// USE DOCTORS HOOK
// =====================================================
interface UseDoctorsReturn {
  doctors: Doctor[];
  getDoctorById: (id: string) => Doctor | undefined;
  getDoctorsBySpecialization: (specialization: string) => Doctor[];
  getAvailableDoctors: (date: string, time: string) => Doctor[];
}

export const useDoctors = (): UseDoctorsReturn => {
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);

  const getDoctorById = useCallback(
    (id: string) => doctors.find((doctor) => doctor.id === id),
    [doctors]
  );

  const getDoctorsBySpecialization = useCallback(
    (specialization: string) =>
      doctors.filter((doctor) => doctor.specialization === specialization),
    [doctors]
  );

  const getAvailableDoctors = useCallback(
  (date: string, time: string) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const dayOfWeek = days[new Date(date).getDay()] as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

    return doctors.filter((doctor) => {
      if (doctor.status !== 'available') return false;
      const availability = doctor.availability.find(
        (a) => a.dayOfWeek === dayOfWeek
      );
      if (!availability || !availability.isAvailable) return false;
      return time >= availability.startTime && time <= availability.endTime;
    });
  },
  [doctors]
);

  return {
    doctors,
    getDoctorById,
    getDoctorsBySpecialization,
    getAvailableDoctors,
  };
};

// =====================================================
// USE APPOINTMENTS HOOK
// =====================================================
interface UseAppointmentsReturn {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  filter: AppointmentFilter;
  setFilter: (filter: AppointmentFilter) => void;
  addAppointment: (data: AppointmentFormData) => Appointment;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
}

export const useAppointments = (
  patients: Patient[],
  doctors: Doctor[]
): UseAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [filter, setFilter] = useState<AppointmentFilter>({
    search: '',
    status: 'all',
    type: 'all',
    doctorId: 'all',
    dateRange: { start: '', end: '' },
  });

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch =
          appointment.patientName.toLowerCase().includes(searchLower) ||
          appointment.doctorName.toLowerCase().includes(searchLower) ||
          appointment.reason.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filter.status !== 'all' && appointment.status !== filter.status) {
        return false;
      }

      // Type filter
      if (filter.type !== 'all' && appointment.type !== filter.type) {
        return false;
      }

      // Doctor filter
      if (filter.doctorId !== 'all' && appointment.doctorId !== filter.doctorId) {
        return false;
      }

      // Date range filter
      if (filter.dateRange.start && appointment.date < filter.dateRange.start) {
        return false;
      }
      if (filter.dateRange.end && appointment.date > filter.dateRange.end) {
        return false;
      }

      return true;
    });
  }, [appointments, filter]);

  // Add appointment
  const addAppointment = useCallback(
    (data: AppointmentFormData): Appointment => {
      const patient = patients.find((p) => p.id === data.patientId);
      const doctor = doctors.find((d) => d.id === data.doctorId);

      const newAppointment: Appointment = {
        id: generateId(),
        patientId: data.patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
        doctorId: data.doctorId,
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : '',
        specialization: doctor?.specialization || 'General Medicine',
        date: data.date,
        time: data.time,
        duration: 30,
        type: data.type,
        status: 'scheduled',
        reason: data.reason,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };

      setAppointments((prev) => [newAppointment, ...prev]);
      return newAppointment;
    },
    [patients, doctors]
  );

  // Update appointment
  const updateAppointment = useCallback((id: string, data: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, ...data } : appointment
      )
    );
  }, []);

  // Cancel appointment
  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
      )
    );
  }, []);

  // Get appointments by date
  const getAppointmentsByDate = useCallback(
    (date: string) =>
      appointments.filter((appointment) => appointment.date === date),
    [appointments]
  );

  // Get appointments by doctor
  const getAppointmentsByDoctor = useCallback(
    (doctorId: string) =>
      appointments.filter((appointment) => appointment.doctorId === doctorId),
    [appointments]
  );

  // Get appointments by patient
  const getAppointmentsByPatient = useCallback(
    (patientId: string) =>
      appointments.filter((appointment) => appointment.patientId === patientId),
    [appointments]
  );

  return {
    appointments,
    filteredAppointments,
    filter,
    setFilter,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentsByDate,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
  };
};

// =====================================================
// USE CALENDAR HOOK
// =====================================================
interface UseCalendarReturn {
  currentDate: Date;
  selectedDate: Date | null;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  getDaysInMonth: () => (Date | null)[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
}

export const useCalendar = (): UseCalendarReturn => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }, []);

  const getDaysInMonth = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentDate]);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  const isSelected = useCallback(
    (date: Date) => {
      if (!selectedDate) return false;
      return (
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    },
    [selectedDate]
  );

  return {
    currentDate,
    selectedDate,
    setCurrentDate,
    setSelectedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getDaysInMonth,
    isToday,
    isSelected,
  };
};
