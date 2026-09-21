import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';

export const DemoAlertsBanner: React.FC = () => {
  const { smartAlerts, dismissSmartAlert } = useApp();

  if (!smartAlerts || smartAlerts.length === 0) {
    return null;
  }

  // Show only top 2 most recent active alerts in the banner
  const activeAlerts = smartAlerts.slice(0, 2);

  return (
    <div className="space-y-2 mb-4">
      {activeAlerts.map((alert) => {
        const isUrgent = alert.severity === 'urgent';
        const isWarning = alert.severity === 'warning';
        const isSuccess = alert.severity === 'success';

        const bgClass = isUrgent
          ? 'bg-rose-50 border-rose-300 text-rose-950'
          : isWarning
          ? 'bg-amber-50 border-amber-300 text-amber-950'
          : isSuccess
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-sky-50 border-sky-300 text-sky-950';

        const iconColor = isUrgent
          ? 'text-rose-600'
          : isWarning
          ? 'text-amber-600'
          : isSuccess
          ? 'text-emerald-600'
          : 'text-sky-600';

        return (
          <div
            key={alert.id}
            className={`rounded-xl border p-3.5 sm:p-4 shadow-2xs transition-all flex items-start justify-between gap-3 ${bgClass}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isUrgent ? (
                  <AlertCircle className={`w-5 h-5 ${iconColor} animate-pulse`} />
                ) : isWarning ? (
                  <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
                ) : isSuccess ? (
                  <CheckCircle2 className={`w-5 h-5 ${iconColor}`} />
                ) : (
                  <Info className={`w-5 h-5 ${iconColor}`} />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm sm:text-base leading-snug">
                    {alert.title}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {alert.timestamp}
                  </span>
                  <Badge variant={isUrgent ? 'danger' : isWarning ? 'warning' : 'info'} size="sm">
                    Simulated Telemetry Alert
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm mt-1 text-slate-700 leading-relaxed">
                  {alert.message}
                </p>

                {/* Mandatory Disclaimer as per User Request */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-[11px] font-bold text-slate-600">
                  <span>{alert.disclaimer}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => dismissSmartAlert(alert.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer shrink-0"
              title="Dismiss Demo Alert"
              aria-label="Dismiss Demo Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
