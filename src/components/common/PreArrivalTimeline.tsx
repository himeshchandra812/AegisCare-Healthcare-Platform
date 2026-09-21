import React from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';

interface PreArrivalTimelineProps {
  compact?: boolean;
  className?: string;
  title?: string;
}

export const PreArrivalTimeline: React.FC<PreArrivalTimelineProps> = ({
  compact = false,
  className = '',
  title = 'Case Status Timeline (10-Stage Emergency Protocol)',
}) => {
  const { preArrivalTimelineSteps, preArrivalStatus } = useApp();
  const [isExpanded, setIsExpanded] = React.useState(!compact);

  const completedCount = preArrivalTimelineSteps.filter((s) => s.status === 'completed').length;
  const currentStep = preArrivalTimelineSteps.find((s) => s.status === 'current');

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-sky-800">
              Protocol Milestone Tracking
            </span>
            <Badge variant="info" size="sm">
              Simulated Timeline
            </Badge>
            {preArrivalStatus === 'Rejected' && (
              <Badge variant="danger" size="sm">
                Diverted / Rejected
              </Badge>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Progress: {completedCount} of 10 milestones completed &bull; Current:{' '}
            <span className="font-semibold text-slate-800">
              {currentStep ? currentStep.title : 'All Complete / Handover Done'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {compact && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-sky-700 hover:text-sky-800 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse' : 'View All 10 Steps'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100">
        <div
          className={`h-full transition-all duration-500 ${
            preArrivalStatus === 'Rejected'
              ? 'bg-rose-500'
              : completedCount === 10
              ? 'bg-emerald-500'
              : 'bg-sky-600'
          }`}
          style={{ width: `${(completedCount / 10) * 100}%` }}
        />
      </div>

      {/* Timeline Steps List */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preArrivalTimelineSteps.map((step) => {
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              const isPending = step.status === 'pending';

              return (
                <div
                  key={step.stepNumber}
                  className={`p-3.5 rounded-xl border transition-all text-xs flex gap-3 ${
                    isCurrent
                      ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-200 shadow-xs'
                      : isCompleted
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-black animate-pulse text-[11px]">
                        {step.stepNumber}
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-[11px] border border-slate-200">
                        {step.stepNumber}
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={`font-bold leading-tight ${
                          isCurrent ? 'text-sky-950 font-black' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {step.stepNumber}. {step.title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                        {step.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-normal line-clamp-2">
                      {step.description}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">Actor:</span>
                      <span className="truncate">{step.actor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Simulated Demo Timeline &bull; Timestamps and milestones are simulated for presentation.</span>
            </div>
            <span className="font-semibold text-slate-600">Telangana 108 Emergency Relay</span>
          </div>
        </div>
      )}
    </div>
  );
};
