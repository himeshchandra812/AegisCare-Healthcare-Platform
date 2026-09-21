import React, { useState } from 'react';
import {
  Building2,
  HeartPulse,
  Users,
  Stethoscope,
  Activity,
  Wind,
  Droplet,
  Bed,
  CheckCircle2,
  Clock,
  AlertCircle,
  MinusCircle,
  Edit2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';
import {
  PreArrivalResourceName,
  PreArrivalResourceStatus,
  PreArrivalHospitalResource,
} from '../../types';

interface HospitalResourcePrepCardProps {
  editable?: boolean;
  className?: string;
  title?: string;
}

export const HospitalResourcePrepCard: React.FC<HospitalResourcePrepCardProps> = ({
  editable = true,
  className = '',
  title = 'Hospital Resource Preparation Status',
}) => {
  const {
    preArrivalResources,
    updatePreArrivalResourceStatus,
    currentRole,
  } = useApp();

  const [editingResource, setEditingResource] = useState<PreArrivalResourceName | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Hospital Admins and Doctors have edit permission (Section 6)
  const canEdit = editable && (currentRole === 'hospital' || currentRole === 'doctor');

  const getResourceIcon = (name: PreArrivalResourceName) => {
    switch (name) {
      case 'Emergency Department':
        return <Building2 className="w-4 h-4 text-sky-600" />;
      case 'ICU':
        return <Bed className="w-4 h-4 text-indigo-600" />;
      case 'Trauma Team':
        return <Users className="w-4 h-4 text-rose-600" />;
      case 'Cardiologist':
        return <HeartPulse className="w-4 h-4 text-rose-700" />;
      case 'Neurologist':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'Ventilator':
        return <Wind className="w-4 h-4 text-teal-600" />;
      case 'Blood Bank':
        return <Droplet className="w-4 h-4 text-red-600" />;
      case 'Emergency Bed':
        return <Bed className="w-4 h-4 text-amber-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: PreArrivalResourceStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Available</span>
          </span>
        );
      case 'Preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Preparing</span>
          </span>
        );
      case 'Unavailable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Unavailable</span>
          </span>
        );
      case 'Not Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <MinusCircle className="w-3 h-3 text-slate-500" />
            <span>Not Required</span>
          </span>
        );
    }
  };

  const statusOptions: PreArrivalResourceStatus[] = [
    'Available',
    'Preparing',
    'Unavailable',
    'Not Required',
  ];

  const handleStatusChange = (
    name: PreArrivalResourceName,
    newStatus: PreArrivalResourceStatus
  ) => {
    updatePreArrivalResourceStatus(name, newStatus, tempNote || undefined);
    setEditingResource(null);
    setTempNote('');
  };

  const availableCount = preArrivalResources.filter((r) => r.status === 'Available').length;
  const preparingCount = preArrivalResources.filter((r) => r.status === 'Preparing').length;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900">
              Emergency Preparedness Matrix
            </span>
            <Badge variant="warning" size="sm">
              Simulated Demo Data
            </Badge>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hyderabad Apex Trauma Center &bull; Ready: <span className="font-bold text-emerald-700">{availableCount}</span> Available,{' '}
            <span className="font-bold text-amber-700">{preparingCount}</span> Preparing
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!canEdit && (
            <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              Role: View Only ({currentRole})
            </span>
          )}
          {canEdit && (
            <button
              onClick={() => {
                // Quick mass prep action
                preArrivalResources.forEach((r) => {
                  if (r.name === 'Emergency Department' || r.name === 'Trauma Team' || r.name === 'Cardiologist') {
                    updatePreArrivalResourceStatus(r.name, 'Available');
                  } else if (r.name === 'Emergency Bed' || r.name === 'ICU') {
                    updatePreArrivalResourceStatus(r.name, 'Preparing');
                  }
                });
              }}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Stage Cardiac Emergency (Demo Preset)
            </button>
          )}
        </div>
      </div>

      {/* Grid of 8 Resources */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {preArrivalResources.map((resource) => {
            const isEditing = editingResource === resource.name;

            return (
              <div
                key={resource.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {getResourceIcon(resource.name)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 leading-tight">
                          {resource.name}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          {resource.category}
                        </span>
                      </div>
                    </div>

                    {getStatusBadge(resource.status)}
                  </div>

                  {resource.assignedUnit && (
                    <div className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 mt-1 mb-2 truncate">
                      {resource.assignedUnit}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Updated {resource.updatedAt}</span>

                  {canEdit && (
                    <div className="relative">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={resource.status}
                            onChange={(e) =>
                              handleStatusChange(
                                resource.name,
                                e.target.value as PreArrivalResourceStatus
                              )
                            }
                            className="text-[11px] font-bold bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-slate-800 focus:outline-none"
                            autoFocus
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingResource(null)}
                            className="text-slate-400 hover:text-slate-600 px-1 font-bold"
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingResource(resource.name);
                            setTempNote(resource.assignedUnit || '');
                          }}
                          className="font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Simulated Data Disclaimer Banner */}
        <div className="mt-4 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Simulated Demo Data:</strong> Resource availability, bed counts, and specialist statuses are generated for prototype validation only.
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0 hidden sm:inline-block">
            Prototype Only
          </span>
        </div>
      </div>
    </div>
  );
};
