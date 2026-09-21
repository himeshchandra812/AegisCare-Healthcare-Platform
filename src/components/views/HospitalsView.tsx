import React, { useState } from 'react';
import {
  Building2,
  Clock,
  MapPin,
  Bed,
  Shield,
  Phone,
  Search,
  IndianRupee,
} from 'lucide-react';
import { DEMO_HOSPITALS } from '../../data/mockData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const HospitalsView: React.FC = () => {
  const { changePreArrivalHospital, smartDestinationHospital } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  const filteredHospitals = DEMO_HOSPITALS.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.traumaLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectHospital = (hospital: (typeof DEMO_HOSPITALS)[0]) => {
    setSelectedHospitalId(hospital.id);
    changePreArrivalHospital(hospital.name, hospital.id);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Hospital Pre-Arrival & Capacity Network (Hyderabad)
            </Badge>
            <span className="text-xs text-slate-500 font-medium">3 Partner Facilities (Demo)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Emergency Departments & Hospital Finder
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Live emergency room wait times, bed availability, trauma tier capabilities, and pre-arrival triage integration across Hyderabad & Telangana.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospitals or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 bg-white"
          />
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHospitals.map((hospital) => {
          const isSelected = selectedHospitalId === hospital.id || smartDestinationHospital === hospital.name;

          return (
            <Card
              key={hospital.id}
              variant={isSelected ? 'highlight' : 'default'}
              padding="lg"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="purple" size="sm">
                    {hospital.traumaLevel}
                  </Badge>
                  <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {hospital.estimatedDriveMin} min drive ({hospital.distanceKm} km)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">
                  {hospital.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{hospital.address}</span>
                </p>

                {/* Capacity indicators & ER costs in INR */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">ER Wait Time:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      ~{hospital.erWaitTimeMin} mins
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Available ER Beds:</span>
                    <span className="font-bold text-slate-800">
                      {hospital.availableBeds.er} open
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">ICU Beds:</span>
                    <span className="font-bold text-slate-800">
                      {hospital.availableBeds.icu} open
                    </span>
                  </div>

                  {hospital.emergencyFeeInr && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Emergency Triage Base:</span>
                      <span className="font-bold text-slate-900">
                        ₹{hospital.emergencyFeeInr.toLocaleString('en-IN')} (Ayushman Accepted)
                      </span>
                    </div>
                  )}
                </div>

                {/* Specialties tags */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Specialized Centers
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Phone className="w-3.5 h-3.5" />
                    {hospital.contactPhone}
                  </span>
                  {hospital.helipadAvailable && (
                    <span className="text-emerald-700 font-bold">Helipad Ready</span>
                  )}
                </div>

                <Button
                  variant={isSelected ? 'success' : 'outline'}
                  size="sm"
                  fullWidth
                  onClick={() => handleSelectHospital(hospital)}
                >
                  {isSelected ? 'Selected for Pre-Arrival Coordination' : 'Select Inbound Destination'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
