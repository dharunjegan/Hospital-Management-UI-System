'use client';

import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { Patient, Doctor, AppointmentFormData } from './types';
import { TIME_SLOTS, formatTime } from './constants';

// ============================
// Zod Validation Schema
// ============================

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  type: z.enum([
    'consultation',
    'follow-up',
    'emergency',
    'routine-checkup',
    'surgery',
  ]),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof appointmentSchema>;

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
  patients: Patient[];
  doctors: Doctor[];
  selectedDate?: string;
  selectedDoctor?: Doctor | null;
}

// ============================
// Animation Variants
// ============================

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ============================
// Component
// ============================

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patients,
  doctors,
  selectedDate,
  selectedDoctor,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: selectedDate || new Date().toISOString().split('T')[0],
      doctorId: selectedDoctor?.id || '',
      type: 'consultation',
    },
  });

  const selectedPatientId = watch('patientId');
  const selectedDoctorId = watch('doctorId');
  const appointmentDate = watch('date');

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId),
    [patients, selectedPatientId]
  );

  const selectedDoctorData = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId),
    [doctors, selectedDoctorId]
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        patientId: '',
        doctorId: selectedDoctor?.id || '',
        date: selectedDate || new Date().toISOString().split('T')[0],
        time: '',
        type: 'consultation',
        reason: '',
        notes: '',
      });
    }
  }, [isOpen, selectedDate, selectedDoctor, reset]);

  const onFormSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(data as AppointmentFormData);
    onClose();
  };

  const availableTimeSlots = useMemo(() => {
    if (!selectedDoctorData || !appointmentDate) return TIME_SLOTS;

    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ] as const;

    const dayOfWeek = days[new Date(appointmentDate).getDay()];

    const availability = selectedDoctorData.availability.find(
      (a) => a.dayOfWeek === dayOfWeek
    );

    if (!availability || !availability.isAvailable) return [];

    return TIME_SLOTS.filter(
      (time) =>
        time >= availability.startTime && time <= availability.endTime
    );
  }, [selectedDoctorData, appointmentDate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl"
          >
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-slate-700">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-white">
                Book Appointment
              </h2>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="p-6 space-y-4"
            >
              {/* Patient */}
              <div>
                <label className="text-sm text-slate-400">Patient *</label>
                <select
                  {...register('patientId')}
                  className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-xs text-red-400">
                    {errors.patientId.message}
                  </p>
                )}
              </div>

              {/* Doctor */}
              <div>
                <label className="text-sm text-slate-400">Doctor *</label>
                <select
                  {...register('doctorId')}
                  className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                >
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName}
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <p className="text-xs text-red-400">
                    {errors.doctorId.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-slate-400">Date *</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                />
                {errors.date && (
                  <p className="text-xs text-red-400">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="text-sm text-slate-400">Time *</label>
                <select
                  {...register('time')}
                  className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                >
                  <option value="">Select time</option>
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-xs text-red-400">
                    {errors.time.message}
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm text-slate-400">
                  Reason for Visit *
                </label>
                <textarea
                  {...register('reason')}
                  rows={3}
                  className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white"
                />
                {errors.reason && (
                  <p className="text-xs text-red-400">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;