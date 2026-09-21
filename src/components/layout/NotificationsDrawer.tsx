import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { NavigationItemId } from '../../types';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView,
  } = useApp();

  if (!isNotificationsDrawerOpen) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-sky-600" />;
    }
  };

  const handleActionClick = (actionUrl?: NavigationItemId, id?: string) => {
    if (id) markNotificationAsRead(id);
    if (actionUrl) {
      setCurrentView(actionUrl);
      setIsNotificationsDrawerOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end"
      onClick={() => setIsNotificationsDrawerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications panel"
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-sky-700" />
            <span className="font-bold text-lg text-slate-900">Notifications & Alerts</span>
          </div>
          <button
            onClick={() => setIsNotificationsDrawerOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
            aria-label="Close notifications"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs bg-white">
          <span className="text-slate-500 font-medium">
            {notifications.length} simulated alerts
          </span>
          <button
            onClick={markAllNotificationsAsRead}
            className="text-sky-700 hover:text-sky-900 font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all ${
                notif.read
                  ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                  : 'bg-white border-sky-300 ring-1 ring-sky-200 shadow-xs text-slate-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{getSeverityIcon(notif.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900">{notif.title}</span>
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                  <div className="mt-2.5 flex items-center justify-between">
                    {notif.actionUrl && (
                      <button
                        onClick={() => handleActionClick(notif.actionUrl, notif.id)}
                        className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open module</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-xs text-slate-400 hover:text-slate-700 ml-auto cursor-pointer"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
