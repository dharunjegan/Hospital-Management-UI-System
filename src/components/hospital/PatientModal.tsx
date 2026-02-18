'use client';
// =====================================================
// PATIENT MODAL COMPONENT
// Features: Form validation with React Hook Form, Zod
// =====================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FieldErrors, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User, Phone, Mail, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { Patient, PatientFormData, BloodType } from './types';
import { BLOOD_TYPES } from './constants';

// Zod validation schema
const patientSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
  bloodType: z.enum(BLOOD_TYPES as [BloodType, ...BloodType[]], {
    required_error: 'Please select a blood type',
  }),
  phone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, 'Phone format: (555) 123-4567'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, 'Phone format: (555) 123-4567'),
  emergencyContactRelation: z.string().min(1, 'Relationship is required'),
  allergies: z.string(),
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
});

type FormValues = z.infer<typeof patientSchema>;

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => void;
  patient?: Patient | null;
  mode: 'add' | 'edit';
}

// Input field component (defined outside to avoid lint errors)
interface InputFieldProps {
  label: string;
  name: keyof FormValues;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  icon,
  type = 'text',
  placeholder,
  required,
  register,
  errors,
}) => (
  <div className="space-y-1">
    <label className="text-sm text-slate-400 flex items-center gap-1">
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
      )}
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full bg-slate-800 border rounded-lg py-2.5 ${
          icon ? 'pl-10' : 'pl-3'
        } pr-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[name] ? 'border-red-500' : 'border-slate-600'
        }`}
      />
    </div>
    {errors[name] && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-400 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        {errors[name]?.message}
      </motion.p>
    )}
  </div>
);

// Select field component (defined outside to avoid lint errors)
interface SelectFieldProps {
  label: string;
  name: keyof FormValues;
  options: { value: string; label: string }[];
  required?: boolean;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  required,
  register,
  errors,
}) => (
  <div className="space-y-1">
    <label className="text-sm text-slate-400 flex items-center gap-1">
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    <select
      {...register(name)}
      className={`w-full bg-slate-800 border rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors[name] ? 'border-red-500' : 'border-slate-600'
      }`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[name] && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-400 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        {errors[name]?.message}
      </motion.p>
    )}
  </div>
);

const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodType: patient.bloodType,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          emergencyContactName: patient.emergencyContact.name,
          emergencyContactPhone: patient.emergencyContact.phone,
          emergencyContactRelation: patient.emergencyContact.relationship,
          allergies: patient.allergies.join(', '),
          insuranceProvider: patient.insurance.provider,
          policyNumber: patient.insurance.policyNumber,
        }
      : undefined,
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (patient && mode === 'edit') {
        reset({
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodType: patient.bloodType,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          emergencyContactName: patient.emergencyContact.name,
          emergencyContactPhone: patient.emergencyContact.phone,
          emergencyContactRelation: patient.emergencyContact.relationship,
          allergies: patient.allergies.join(', '),
          insuranceProvider: patient.insurance.provider,
          policyNumber: patient.insurance.policyNumber,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, patient, mode, reset]);

  const onFormSubmit = async (data: FormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(data as PatientFormData);
    onClose();
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-700 shadow-2xl my-8"
          >
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-500/10 to-transparent">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {mode === 'add' ? 'Add New Patient' : 'Edit Patient'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {mode === 'add'
                      ? 'Fill in the patient details below'
                      : 'Update patient information'}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 border-b border-slate-700 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="firstName"
                    icon={<User className="w-4 h-4" />}
                    placeholder="John"
                    required
                    register={register}
                    errors={errors}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    icon={<User className="w-4 h-4" />}
                    placeholder="Smith"
                    required
                    register={register}
                    errors={errors}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    required
                    register={register}
                    errors={errors}
                  />
                  <SelectField
                    label="Gender"
                    name="gender"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                    required
                    register={register}
                    errors={errors}
                  />
                  <SelectField
                    label="Blood Type"
                    name="bloodType"
                    options={BLOOD_TYPES.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    required
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 border-b border-slate-700 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Phone"
                    name="phone"
                    icon={<Phone className="w-4 h-4" />}
                    placeholder="(555) 123-4567"
                    required
                    register={register}
                    errors={errors}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                    placeholder="john@email.com"
                    required
                    register={register}
                    errors={errors}
                  />
                </div>
                <InputField
                  label="Address"
                  name="address"
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="123 Main Street, City, State ZIP"
                  required
                  register={register}
                  errors={errors}
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 border-b border-slate-700 pb-2">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Contact Name"
                    name="emergencyContactName"
                    placeholder="Jane Smith"
                    required
                    register={register}
                    errors={errors}
                  />
                  <InputField
                    label="Contact Phone"
                    name="emergencyContactPhone"
                    placeholder="(555) 123-4567"
                    required
                    register={register}
                    errors={errors}
                  />
                  <InputField
                    label="Relationship"
                    name="emergencyContactRelation"
                    placeholder="Spouse"
                    required
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Medical & Insurance */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 border-b border-slate-700 pb-2">
                  Medical & Insurance Information
                </h3>
                <InputField
                  label="Allergies (comma-separated)"
                  name="allergies"
                  placeholder="Penicillin, Sulfa, Peanuts"
                  register={register}
                  errors={errors}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Insurance Provider"
                    name="insuranceProvider"
                    placeholder="Blue Cross Blue Shield"
                    required
                    register={register}
                    errors={errors}
                  />
                  <InputField
                    label="Policy Number"
                    name="policyNumber"
                    placeholder="BCBS-123456789"
                    required
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </span>
                  ) : mode === 'add' ? (
                    'Add Patient'
                  ) : (
                    'Save Changes'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PatientModal;
