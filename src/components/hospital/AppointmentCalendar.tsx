'use client';
// =====================================================
// APPOINTMENT CALENDAR COMPONENT
// Features: Month view, appointment indicators, date selection
// =====================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Appointment } from './types';
import { formatTime, STATUS_COLORS } from './constants';

interface AppointmentCalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  appointments: Appointment[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (date: Date) => void;
  onAddAppointment: (date: string) => void;
  getDaysInMonth: () => (Date | null)[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  currentDate,
  selectedDate,
  appointments,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onSelectDate,
  onAddAppointment,
  getDaysInMonth,
  isToday,
  isSelected,
}) => {
  const days = getDaysInMonth();

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter((apt) => apt.date === dateStr);
  };

  // Get appointment color based on status
  const getAppointmentColor = (status: Appointment['status']) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-500',
      confirmed: 'bg-green-500',
      'in-progress': 'bg-amber-500',
      completed: 'bg-slate-500',
      cancelled: 'bg-red-500',
      'no-show': 'bg-purple-500',
    };
    return colors[status] || 'bg-slate-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToday}
              className="px-3 py-1 text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              Today
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPreviousMonth}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNextMonth}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-slate-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-24" />;
            }

            const dateAppointments = getAppointmentsForDate(date);
            const today = isToday(date);
            const selected = isSelected(date);

            return (
              <motion.div
                key={date.toISOString()}
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelectDate(date)}
                className={`relative h-24 p-2 rounded-lg cursor-pointer transition-colors border ${
                  selected
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : today
                    ? 'bg-slate-800/50 border-slate-600'
                    : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'
                }`}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      today
                        ? 'w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full'
                        : 'text-slate-300'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {dateAppointments.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {dateAppointments.length}
                    </span>
                  )}
                </div>

                {/* Appointments */}
                <div className="space-y-1 overflow-hidden">
                  {dateAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className={`text-xs px-1.5 py-0.5 rounded truncate ${getAppointmentColor(
                        apt.status
                      )} text-white`}
                    >
                      {formatTime(apt.time)} {apt.patientName.split(' ')[0]}
                    </div>
                  ))}
                  {dateAppointments.length > 2 && (
                    <div className="text-xs text-slate-500 px-1">
                      +{dateAppointments.length - 2} more
                    </div>
                  )}
                </div>

                {/* Add button on hover */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddAppointment(date.toISOString().split('T')[0]);
                  }}
                  className="absolute bottom-1 right-1 p-1 text-slate-500 hover:text-white opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">
                  Appointments for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddAppointment(selectedDate.toISOString().split('T')[0])}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + Add
                </motion.button>
              </div>

              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No appointments scheduled
                </p>
              ) : (
                <div className="space-y-2">
                  {getAppointmentsForDate(selectedDate).map((apt) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/30"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${getAppointmentColor(apt.status)}`}
                        />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {apt.patientName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {apt.doctorName} • {apt.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">
                          {formatTime(apt.time)}
                        </p>
                        <span
                          className={`text-xs ${
                            STATUS_COLORS.appointment[apt.status].text
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AppointmentCalendar;
