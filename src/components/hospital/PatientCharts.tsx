'use client';
// =====================================================
// PATIENT CHARTS COMPONENT
// Features: Demographics, trends, department statistics
// =====================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { Users, TrendingUp, Building2, DollarSign } from 'lucide-react';
import {
  PatientDemographics,
  MonthlyPatientData,
  DepartmentStats,
} from './types';
import {
  PATIENT_DEMOGRAPHICS,
  MONTHLY_PATIENT_DATA,
  DEPARTMENT_STATS,
} from './constants';

interface PatientChartsProps {
  demographics?: PatientDemographics[];
  monthlyData?: MonthlyPatientData[];
  departmentStats?: DepartmentStats[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="text-slate-300 text-sm font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PatientCharts: React.FC<PatientChartsProps> = ({
  demographics = PATIENT_DEMOGRAPHICS,
  monthlyData = MONTHLY_PATIENT_DATA,
  departmentStats = DEPARTMENT_STATS,
}) => {
  const [activeChart, setActiveChart] = useState<'demographics' | 'trends' | 'departments'>('demographics');

  // Calculate total patients for pie chart
  const totalPatients = demographics.reduce(
    (sum, group) => sum + group.male + group.female,
    0
  );

  // Prepare pie chart data for gender distribution
  const genderData = [
    { name: 'Male', value: demographics.reduce((sum, g) => sum + g.male, 0) },
    { name: 'Female', value: demographics.reduce((sum, g) => sum + g.female, 0) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Chart Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'demographics', label: 'Demographics', icon: Users },
          { id: 'trends', label: 'Patient Trends', icon: TrendingUp },
          { id: 'departments', label: 'Departments', icon: Building2 },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveChart(tab.id as typeof activeChart)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeChart === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6"
        >
          {activeChart === 'demographics' && (
            <>
              <h3 className="text-lg font-semibold text-white mb-4">
                Age Distribution by Gender
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="ageGroup" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="male" name="Male" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="female" name="Female" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeChart === 'trends' && (
            <>
              <h3 className="text-lg font-semibold text-white mb-4">
                Monthly Patient Trends
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                    <Area
                      type="monotone"
                      dataKey="newPatients"
                      name="New Patients"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorNew)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeChart === 'departments' && (
            <>
              <h3 className="text-lg font-semibold text-white mb-4">
                Patients by Department
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                    <YAxis
                      dataKey="department"
                      type="category"
                      stroke="#64748b"
                      fontSize={11}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="patients" name="Patients" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>

        {/* Secondary Charts */}
        <div className="space-y-6">
          {/* Gender Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Gender Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#3B82F6' : '#EC4899'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalPatients}</p>
                <p className="text-xs text-slate-500">Total Patients</p>
              </div>
            </div>
          </motion.div>

          {/* Department Revenue */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Revenue by Department
            </h3>
            <div className="space-y-3">
              {departmentStats.slice(0, 5).map((dept, index) => (
                <div key={dept.department} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-300">{dept.department}</span>
                      <span className="text-sm font-medium text-white">
                        ${(dept.revenue / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(dept.revenue / Math.max(...departmentStats.map((d) => d.revenue))) * 100}%`,
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientCharts;
