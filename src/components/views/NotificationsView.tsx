import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { NavigationItemId } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView,
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filtered = notifications.filter(
    (n) => filterSeverity === 'all' || n.severity === filterSeverity
  );

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

  const handleAction = (url?: NavigationItemId, id?: string) => {
    if (id) markNotificationAsRead(id);
    if (url) setCurrentView(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Alert Stream
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Notifications & System Alerts
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Dispatch milestones, pre-arrival status updates, and emergency alerts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<CheckCheck className="w-4 h-4" />}
          onClick={markAllNotificationsAsRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filter:</span>
        {['all', 'urgent', 'info', 'success'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
              filterSeverity === sev
                ? 'bg-sky-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.read
                ? 'bg-white border-slate-200 text-slate-700'
                : 'bg-white border-sky-300 ring-2 ring-sky-200/50 shadow-xs text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="shrink-0 mt-0.5">{getSeverityIcon(item.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                  <span className="text-xs text-slate-400 font-medium">{item.timestamp}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.message}</p>

                <div className="mt-3 flex items-center justify-between">
                  {item.actionUrl && (
                    <button
                      onClick={() => handleAction(item.actionUrl, item.id)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jump to {item.actionUrl.replace('_', ' ')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!item.read && (
                    <button
                      onClick={() => markNotificationAsRead(item.id)}
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
  );
};
