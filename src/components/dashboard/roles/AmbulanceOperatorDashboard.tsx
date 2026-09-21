import React, { useState } from 'react';
import {
  Radio,
  Ambulance,
  MapPin,
  CheckCircle2,
  Clock,
  BatteryCharging,
  Gauge,
  Phone,
  AlertTriangle,
  Building,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Wrench,
  Fuel,
  Users,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { DEMO_AMBULANCES, DEMO_HOSPITALS } from '../../../data/mockData';

export const AmbulanceOperatorDashboard: React.FC = () => {
  const { setCurrentView } = useApp();

  // Fleet state with 4 vehicles
  const [fleet, setFleet] = useState([
    {
      id: 'amb-402',
      unitCode: 'Unit 108-Hyd-42',
      type: 'Advanced Life Support (ALS)',
      status: 'In Transit to ER',
      driverName: 'Ravi Kumar',
      emtName: 'Priya Sharma, Paramedic',
      currentLocation: 'Road No. 36, Jubilee Hills (1.4 km from Hospital)',
      hospitalDestination: 'Hyderabad Apex Trauma & Multi-Speciality (Demo)',
      etaMinutes: 4,
      oxygenLevel: 96,
      batteryReserve: 92,
      fuel: '84%',
      nextService: '2026-10-15',
    },
    {
      id: 'amb-109',
      unitCode: 'Unit 108-Hyd-15',
      type: 'Basic Life Support (BLS)',
      status: 'Available',
      driverName: 'Venkatesh Naidu',
      emtName: 'Suresh Babu, EMT-B',
      currentLocation: 'EMS Base Station, Gachibowli Depot',
      hospitalDestination: 'Standby at Base',
      etaMinutes: 0,
      oxygenLevel: 98,
      batteryReserve: 97,
      fuel: '92%',
      nextService: '2026-11-01',
    },
    {
      id: 'amb-315',
      unitCode: 'Unit 108-Hyd-88',
      type: 'Critical Care Transport',
      status: 'Dispatched',
      driverName: 'Mohammed Feroz',
      emtName: 'Sunita Das, Critical Care Paramedic',
      currentLocation: 'Outer Ring Road (ORR) Exit 19, Shamshabad corridor',
      hospitalDestination: 'Telangana Institute of Cardiac Sciences (Demo)',
      etaMinutes: 11,
      oxygenLevel: 90,
      batteryReserve: 84,
      fuel: '76%',
      nextService: '2026-09-30',
    },
    {
      id: 'amb-007',
      unitCode: 'Unit 108-Hyd-07',
      type: 'Advanced Life Support (ALS)',
      status: 'Scheduled Maintenance',
      driverName: 'K. Ramesh',
      emtName: 'Unassigned (In Depot)',
      currentLocation: 'Central EMS Maintenance Depot, Sanathnagar',
      hospitalDestination: 'Workshop Bay 3',
      etaMinutes: 0,
      oxygenLevel: 45,
      batteryReserve: 60,
      fuel: '50%',
      nextService: 'In Service Today',
    },
  ]);

  // Dispatch queue
  const [dispatchQueue, setDispatchQueue] = useState([
    {
      id: 'DISP-112-984',
      caller: 'Banjara Hills Junction Traffic Police',
      nature: 'Two-wheeler collision with trauma',
      priority: 'High',
      time: '3 mins ago',
      assigned: false,
    },
    {
      id: 'DISP-112-985',
      caller: 'Madhapur Metro Station Attendant',
      nature: 'Elderly passenger syncopal episode',
      priority: 'Urgent',
      time: '6 mins ago',
      assigned: false,
    },
  ]);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleAssignUnit = (dispatchId: string) => {
    setDispatchQueue(
      dispatchQueue.map((item) =>
        item.id === dispatchId ? { ...item, assigned: true } : item
      )
    );
    setNotificationMsg(`Unit 108-Hyd-15 successfully dispatched to ${dispatchId}. Route transmitted.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="warning" size="md">
              108 Emergency Fleet Operations
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Cyberabad Dispatch Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Ambulance Fleet & Dispatch Console
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time tracking of active ambulances, driver/EMT rosters, 112 emergency calls, and hospital destination routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView('smart_ambulance')}
            className="text-xs"
          >
            Full GPS Radar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentView('analytics')}
            className="text-xs"
          >
            Fleet Analytics
          </Button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Operational KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Fleet Active</span>
          <div className="text-2xl font-black text-slate-900 mt-1">4 Units</div>
          <span className="text-[11px] font-semibold text-emerald-700">75% In Operational Duty</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Avg Response Time</span>
          <div className="text-2xl font-black text-sky-700 mt-1">7.4 min</div>
          <span className="text-[11px] font-semibold text-slate-500">Cyberabad & ORR Corridor</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Active Runs Today</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">48 Dispatches</div>
          <span className="text-[11px] font-semibold text-slate-500">100% Hospital Handover</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Green Corridors</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">2 Active</div>
          <span className="text-[11px] font-semibold text-slate-500">Traffic Police Pre-emption</span>
        </div>
      </div>

      {/* Main Grid: Ambulance Fleet Matrix & Dispatch Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fleet Availability Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-sky-700" />
                <span>Ambulance Fleet Status & Locations</span>
              </h2>
              <Badge variant="info" size="sm">4 Registered Units</Badge>
            </div>

            <div className="space-y-3.5">
              {fleet.map((amb) => (
                <div
                  key={amb.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base">{amb.unitCode}</span>
                        <Badge
                          variant={
                            amb.status === 'Available'
                              ? 'success'
                              : amb.status.includes('Transit')
                              ? 'warning'
                              : amb.status === 'Dispatched'
                              ? 'info'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {amb.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{amb.type}</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-slate-700 block">Destination:</span>
                      <span className="text-xs font-medium text-sky-800">{amb.hospitalDestination}</span>
                    </div>
                  </div>

                  {/* Location & Crew */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold block">Current Location:</span>
                      <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {amb.currentLocation}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block">Assigned Crew:</span>
                      <span className="font-medium text-slate-800 block mt-0.5">
                        Driver: {amb.driverName} • EMT: {amb.emtName}
                      </span>
                    </div>
                  </div>

                  {/* Vitals, Fuel & Maintenance */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                        O2: <strong>{amb.oxygenLevel}%</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <BatteryCharging className="w-3.5 h-3.5 text-sky-600" />
                        Battery: <strong>{amb.batteryReserve}%</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-amber-600" />
                        Fuel: <strong>{amb.fuel}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Wrench className="w-3 h-3" />
                      <span>Next service: {amb.nextService}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Incoming 112 Dispatches & Traffic */}
        <div className="space-y-6">
          {/* Dispatch Requests Queue */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-700" />
                <span>112 Emergency Dispatch Queue</span>
              </h3>
              <Badge variant="warning" size="sm">{dispatchQueue.filter((d) => !d.assigned).length} Pending</Badge>
            </div>

            <div className="space-y-3">
              {dispatchQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    item.assigned
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-amber-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900">{item.id}</span>
                    <Badge variant={item.assigned ? 'neutral' : 'danger'} size="sm">
                      {item.assigned ? 'Assigned' : item.priority}
                    </Badge>
                  </div>
                  <div className="font-semibold text-slate-800">{item.nature}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Caller: {item.caller} • {item.time}</div>

                  {!item.assigned ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAssignUnit(item.id)}
                      className="w-full mt-2.5 text-xs py-1.5"
                    >
                      Assign Nearest Unit (Unit 108-Hyd-15)
                    </Button>
                  ) : (
                    <div className="mt-2 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dispatched (Unit 108-Hyd-15 en route)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Hyderabad Green Corridor & Traffic Status */}
          <Card variant="default" padding="lg">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Green Corridor Pre-emption</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-emerald-950">Corridor 1: Road No. 36 (Jubilee Hills)</div>
                <div className="text-emerald-800 text-[11px] mt-0.5">
                  Traffic signal pre-emption wave active for Unit 108-Hyd-42. Delay index: 0 min.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">Corridor 2: Outer Ring Road Exit 19</div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  Toll bypass active for Unit 108-Hyd-88 en route to Cardiac Centre.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
