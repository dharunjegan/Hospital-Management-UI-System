'use client';
// =====================================================
// DOCTOR AVAILABILITY COMPONENT
// Features: Doctor list, availability status, schedule view
// =====================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  ChevronDown,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { Doctor, Specialization, DoctorStatus } from './types';
import { STATUS_COLORS, SPECIALIZATIONS, DAYS_OF_WEEK } from './constants';

interface DoctorAvailabilityProps {
  doctors: Doctor[];
  onBookAppointment: (doctor: Doctor) => void;
}

const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({
  doctors,
  onBookAppointment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | 'all'>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !doctor.firstName.toLowerCase().includes(query) &&
        !doctor.lastName.toLowerCase().includes(query) &&
        !doctor.specialization.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (selectedSpecialization !== 'all' && doctor.specialization !== selectedSpecialization) {
      return false;
    }
    return true;
  });

  // Get status badge
  const getStatusBadge = (status: DoctorStatus) => {
    const colors = STATUS_COLORS.doctor[status];
    const statusLabels: Record<DoctorStatus, string> = {
      available: 'Available',
      busy: 'Busy',
      'off-duty': 'Off Duty',
      'on-leave': 'On Leave',
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
      >
        {statusLabels[status]}
      </span>
    );
  };

  // Get availability for today
 // Get availability for today
  const getTodayAvailability = (doctor: Doctor) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const today = days[new Date().getDay()] as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    
    const availability = doctor.availability.find((a) => a.dayOfWeek === today);
    if (!availability || !availability.isAvailable) {
      return 'Not available today';
    }
    return `${availability.startTime} - ${availability.endTime}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-white">Doctor Availability</h2>
        <p className="text-sm text-slate-400">View and manage doctor schedules</p>
      </div>

      {/* Search and Filter */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Specialization Filter */}
          <div className="relative">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value as Specialization | 'all')}
              className="appearance-none px-4 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Specializations</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec.name} value={spec.name}>
                  {spec.icon} {spec.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Doctor List */}
      <div className="divide-y divide-slate-700/30">
        <AnimatePresence mode="popLayout">
          {filteredDoctors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-slate-500"
            >
              <Users className="w-12 h-12 mb-3" />
              <p className="text-sm">No doctors found</p>
            </motion.div>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 hover:bg-slate-800/30 transition-colors"
              >
                <div
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setSelectedDoctor(selectedDoctor?.id === doctor.id ? null : doctor)}
                >
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ${
                          doctor.status === 'available'
                            ? 'bg-green-500/20 text-green-400'
                            : doctor.status === 'busy'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {doctor.firstName.charAt(0)}
                        {doctor.lastName.charAt(0)}
                      </div>
                      {/* Status indicator */}
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
                          doctor.status === 'available'
                            ? 'bg-green-500'
                            : doctor.status === 'busy'
                            ? 'bg-amber-500'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        {getStatusBadge(doctor.status)}
                      </div>
                      <p className="text-sm text-slate-400">
                        {doctor.specialization} • {doctor.experience} years exp.
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {doctor.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {doctor.totalPatients} patients
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Today's Hours</p>
                      <p className="text-sm text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {getTodayAvailability(doctor)}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookAppointment(doctor);
                      }}
                      disabled={doctor.status !== 'available'}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        doctor.status === 'available'
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Book
                    </motion.button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedDoctor?.id === doctor.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-slate-700/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Contact Info */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-300">Contact</h4>
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm text-slate-400">
                              <Phone className="w-4 h-4" />
                              {doctor.phone}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-slate-400">
                              <Mail className="w-4 h-4" />
                              {doctor.email}
                            </p>
                          </div>
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Education</h4>
                            <ul className="space-y-1">
                              {doctor.education.map((edu, idx) => (
                                <li key={idx} className="text-xs text-slate-400">
                                  • {edu}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Weekly Schedule */}
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Weekly Schedule</h4>
                          <div className="grid grid-cols-7 gap-1">
                            {DAYS_OF_WEEK.map((day) => {
                              const availability = doctor.availability.find(
                                (a) => a.dayOfWeek === day
                              );
                              return (
                                <div
                                  key={day}
                                  className={`text-center p-2 rounded text-xs ${
                                    availability?.isAvailable
                                      ? 'bg-green-500/10 text-green-400'
                                      : 'bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  <div className="font-medium capitalize">
                                    {day.slice(0, 3)}
                                  </div>
                                  {availability?.isAvailable ? (
                                    <div className="mt-1 text-[10px]">
                                      {availability.startTime}
                                    </div>
                                  ) : (
                                    <div className="mt-1">-</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DoctorAvailability;
