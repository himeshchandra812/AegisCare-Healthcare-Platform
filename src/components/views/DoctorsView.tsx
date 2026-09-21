import React, { useState } from 'react';
import {
  Stethoscope,
  Star,
  Building,
  Video,
  User,
  Search,
  Languages,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { DEMO_DOCTORS } from '../../data/mockData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const DoctorsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookedDocId, setBookedDocId] = useState<string | null>(null);

  const filteredDoctors = DEMO_DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hospitalAffiliation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.languages.some((l) => l.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" size="md">
              Physician Network (India)
            </Badge>
            <span className="text-xs text-slate-500 font-medium">On-Call Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Find Doctors & Specialists
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Access board-certified emergency physicians, cardiologists, neurologists, and geriatric specialists across Telugu, Hindi, Tamil, and English.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, specialty, or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 bg-white"
          />
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDoctors.map((doc) => {
          const isBooked = bookedDocId === doc.id;

          return (
            <Card key={doc.id} variant="default" padding="lg" className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-lg">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {doc.name}
                      </h3>
                      <div className="text-xs font-semibold text-teal-800">{doc.title}</div>
                    </div>
                  </div>

                  <Badge
                    variant={
                      doc.availability === 'Available Today'
                        ? 'success'
                        : doc.availability === 'On Call'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {doc.availability}
                  </Badge>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">Specialty:</span>
                    <span className="font-bold text-slate-800">{doc.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">Affiliation:</span>
                    <span className="font-semibold text-sky-800">{doc.hospitalAffiliation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">Languages:</span>
                    <span className="font-bold text-slate-700">{doc.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">Patient Rating:</span>
                    <span className="font-bold text-amber-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {doc.rating} / 5.0
                    </span>
                  </div>
                  {doc.consultationFeeInr && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="font-medium text-slate-500">Consultation Fee:</span>
                      <span className="font-black text-slate-900 text-sm">
                        ₹{doc.consultationFeeInr.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Consultation Modes */}
                <div className="py-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Consultation Channels
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.consultationModes.map((mode, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Button
                  variant={isBooked ? 'success' : 'primary'}
                  size="md"
                  fullWidth
                  onClick={() => setBookedDocId(isBooked ? null : doc.id)}
                >
                  {isBooked ? 'Consultation Request Sent' : 'Request Consult / Telehealth'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
