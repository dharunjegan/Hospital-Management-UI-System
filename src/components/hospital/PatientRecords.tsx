'use client';
// =====================================================
// PATIENT RECORDS COMPONENT
// Features: Filtering, search, patient list with details
// =====================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  User,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
} from 'lucide-react';
import { Patient, PatientFilter, PatientStatus, BloodType } from './types';
import { formatDate, calculateAge, STATUS_COLORS, BLOOD_TYPES } from './constants';

interface PatientRecordsProps {
  patients: Patient[];
  filter: PatientFilter;
  onFilterChange: (filter: PatientFilter) => void;
  onViewPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onAddPatient: () => void;
}

const PatientRecords: React.FC<PatientRecordsProps> = ({
  patients,
  filter,
  onFilterChange,
  onViewPatient,
  onEditPatient,
  onDeletePatient,
  onAddPatient,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Status options
  const statusOptions: { value: PatientStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'admitted', label: 'Admitted' },
    { value: 'discharged', label: 'Discharged' },
    { value: 'critical', label: 'Critical' },
  ];

  // Gender options
  const genderOptions = [
    { value: 'all', label: 'All Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  // Get status badge
  const getStatusBadge = (status: PatientStatus) => {
    const colors = STATUS_COLORS.patient[status];
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Patient Records</h2>
            <p className="text-sm text-slate-400">
              {patients.length} patients found
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddPatient}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            + Add Patient
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-slate-700/50 space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={filter.search}
              onChange={(e) =>
                onFilterChange({ ...filter, search: e.target.value })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </motion.button>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-3 overflow-hidden"
            >
              {/* Status Filter */}
              <select
                value={filter.status}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    status: e.target.value as PatientStatus | 'all',
                  })
                }
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Blood Type Filter */}
              <select
                value={filter.bloodType}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    bloodType: e.target.value as BloodType | 'all',
                  })
                }
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Blood Types</option>
                {BLOOD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* Gender Filter */}
              <select
                value={filter.gender}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    gender: e.target.value as 'male' | 'female' | 'other' | 'all',
                  })
                }
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={() =>
                  onFilterChange({
                    search: '',
                    status: 'all',
                    bloodType: 'all',
                    gender: 'all',
                    dateRange: { start: '', end: '' },
                  })
                }
                className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Patient List */}
      <div className="divide-y divide-slate-700/30">
        <AnimatePresence mode="popLayout">
          {patients.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-slate-500"
            >
              <User className="w-12 h-12 mb-3" />
              <p className="text-sm">No patients found</p>
              <p className="text-xs text-slate-600 mt-1">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            patients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors"
              >
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                      patient.gender === 'male'
                        ? 'bg-blue-500/20 text-blue-400'
                        : patient.gender === 'female'
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {patient.firstName.charAt(0)}
                    {patient.lastName.charAt(0)}
                  </div>

                  {/* Patient Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white truncate">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      {getStatusBadge(patient.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {calculateAge(patient.dateOfBirth)} years
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {patient.gender}
                      </span>
                      <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">
                        {patient.bloodType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Contact */}
                <div className="hidden md:flex flex-col items-end gap-1">
                  <span className="flex items-center gap-1 text-sm text-slate-300">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {patient.phone}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Mail className="w-3 h-3" />
                    {patient.email}
                  </span>
                </div>

                {/* Right Section - Last Visit & Actions */}
                <div className="flex items-center gap-4">
                  <div className="hidden lg:block text-right">
                    <p className="text-xs text-slate-500">Last Visit</p>
                    <p className="text-sm text-slate-300">
                      {formatDate(patient.lastVisit)}
                    </p>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === patient.id ? null : patient.id
                        )
                      }
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === patient.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-1 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10"
                        >
                          <button
                            onClick={() => {
                              onViewPatient(patient);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              onEditPatient(patient);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Patient
                          </button>
                          <button
                            onClick={() => {
                              onDeletePatient(patient.id);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {patients.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {patients.length} patients</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PatientRecords;
