'use client';
// =====================================================
// HOSPITAL DASHBOARD - MAIN COMPONENT
// Orchestrates all hospital management features
// =====================================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Calendar,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  BedDouble,
  DollarSign,
  Bell,
  Search,
  Menu,
} from 'lucide-react';

// Types
import { Patient, Doctor, NavView } from './types';

// Hooks
import { usePatients, useDoctors, useAppointments, useCalendar } from './useHospitalData';

// Components
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import PatientRecords from './PatientRecords';
import AppointmentCalendar from './AppointmentCalendar';
import DoctorAvailability from './DoctorAvailability';
import PatientCharts from './PatientCharts';
import PatientModal from './PatientModal';
import AppointmentModal from './AppointmentModal';

// Constants
import { MOCK_DASHBOARD_STATS, formatCurrency } from './constants';

const HospitalDashboard: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctorForAppointment, setSelectedDoctorForAppointment] = useState<Doctor | null>(null);
  const [patientModalMode, setPatientModalMode] = useState<'add' | 'edit'>('add');

  // Hooks
  const {
    patients,
    filteredPatients,
    filter: patientFilter,
    setFilter: setPatientFilter,
    addPatient,
    updatePatient,
    deletePatient,
  } = usePatients();

  const { doctors, getDoctorById, getAvailableDoctors } = useDoctors();

  const {
    appointments,
    filteredAppointments,
    filter: appointmentFilter,
    setFilter: setAppointmentFilter,
    addAppointment,
    getAppointmentsByDate,
  } = useAppointments(patients, doctors);

  const {
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
  } = useCalendar();

  // Handlers
  const handleViewPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    setPatientModalMode('edit');
    setIsPatientModalOpen(true);
  }, []);

  const handleEditPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    setPatientModalMode('edit');
    setIsPatientModalOpen(true);
  }, []);

  const handleAddPatient = useCallback(() => {
    setSelectedPatient(null);
    setPatientModalMode('add');
    setIsPatientModalOpen(true);
  }, []);

  const handlePatientSubmit = useCallback(
    (data: Parameters<typeof addPatient>[0]) => {
      if (patientModalMode === 'add') {
        addPatient(data);
      } else if (selectedPatient) {
        updatePatient(selectedPatient.id, data);
      }
    },
    [addPatient, updatePatient, patientModalMode, selectedPatient]
  );

  const handleBookAppointment = useCallback((doctor?: Doctor, date?: string) => {
    setSelectedDoctorForAppointment(doctor || null);
    if (date) {
      setCurrentDate(new Date(date));
    }
    setIsAppointmentModalOpen(true);
  }, [setCurrentDate]);

  const handleAppointmentSubmit = useCallback(
    (data: Parameters<typeof addAppointment>[0]) => {
      addAppointment(data);
    },
    [addAppointment]
  );

  const handleSelectCalendarDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setCurrentDate(date);
    },
    [setSelectedDate, setCurrentDate]
  );

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Patients',
      value: patients.length,
      change: { value: 12, isPositive: true },
      icon: Users,
      iconColor: '#3B82F6',
      iconBgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Today\'s Appointments',
      value: getAppointmentsByDate(new Date().toISOString().split('T')[0]).length,
      change: { value: 5, isPositive: true },
      icon: Calendar,
      iconColor: '#10B981',
      iconBgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Available Doctors',
      value: doctors.filter((d) => d.status === 'available').length,
      change: { value: 2, isPositive: false },
      icon: Stethoscope,
      iconColor: '#F59E0B',
      iconBgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Critical Patients',
      value: patients.filter((p) => p.status === 'critical').length,
      change: { value: 1, isPositive: false },
      icon: AlertTriangle,
      iconColor: '#EF4444',
      iconBgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      title: 'Bed Occupancy',
      value: `${MOCK_DASHBOARD_STATS.bedOccupancy}%`,
      change: { value: 3, isPositive: true },
      icon: BedDouble,
      iconColor: '#8B5CF6',
      iconBgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Revenue (Monthly)',
      value: formatCurrency(MOCK_DASHBOARD_STATS.revenue),
      change: { value: 8, isPositive: true },
      icon: DollarSign,
      iconColor: '#EC4899',
      iconBgColor: 'rgba(236, 72, 153, 0.1)',
    },
  ];

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statsCards.map((stat, index) => (
                <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
              ))}
            </div>

            {/* Charts */}
            <PatientCharts />

            {/* Quick Access */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AppointmentCalendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                appointments={appointments}
                onPreviousMonth={goToPreviousMonth}
                onNextMonth={goToNextMonth}
                onToday={goToToday}
                onSelectDate={handleSelectCalendarDate}
                onAddAppointment={(date) => handleBookAppointment(undefined, date)}
                getDaysInMonth={getDaysInMonth}
                isToday={isToday}
                isSelected={isSelected}
              />
              <DoctorAvailability
                doctors={doctors}
                onBookAppointment={(doctor) => handleBookAppointment(doctor)}
              />
            </div>
          </motion.div>
        );

      case 'patients':
        return (
          <PatientRecords
            patients={filteredPatients}
            filter={patientFilter}
            onFilterChange={setPatientFilter}
            onViewPatient={handleViewPatient}
            onEditPatient={handleEditPatient}
            onDeletePatient={deletePatient}
            onAddPatient={handleAddPatient}
          />
        );

      case 'appointments':
        return (
          <AppointmentCalendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            appointments={appointments}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onToday={goToToday}
            onSelectDate={handleSelectCalendarDate}
            onAddAppointment={(date) => handleBookAppointment(undefined, date)}
            getDaysInMonth={getDaysInMonth}
            isToday={isToday}
            isSelected={isSelected}
          />
        );

      case 'doctors':
        return (
          <DoctorAvailability
            doctors={doctors}
            onBookAppointment={(doctor) => handleBookAppointment(doctor)}
          />
        );

      case 'reports':
        return <PatientCharts />;

      default:
        return null;
    }
  };

  // Get page title
  const getPageTitle = () => {
    const titles: Record<NavView, string> = {
      dashboard: 'Dashboard',
      patients: 'Patient Management',
      appointments: 'Appointment Calendar',
      doctors: 'Doctor Availability',
      reports: 'Reports & Analytics',
    };
    return titles[currentView];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <motion.main
        initial={{ marginLeft: isSidebarCollapsed ? 80 : 240 }}
        animate={{ marginLeft: isSidebarCollapsed ? 80 : 240 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {/* Header */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {getPageTitle()}
                  </h1>
                  <p className="text-sm text-slate-500">
                    Welcome back, Admin. Here&apos;s what&apos;s happening today.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {/* Quick Add */}
                {currentView === 'patients' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddPatient}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    + Add Patient
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </motion.main>

      {/* Modals */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setSelectedPatient(null);
        }}
        onSubmit={handlePatientSubmit}
        patient={selectedPatient}
        mode={patientModalMode}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setSelectedDoctorForAppointment(null);
        }}
        onSubmit={handleAppointmentSubmit}
        patients={patients}
        doctors={doctors}
        selectedDate={selectedDate?.toISOString().split('T')[0]}
        selectedDoctor={selectedDoctorForAppointment}
      />
    </div>
  );
};

export default HospitalDashboard;
