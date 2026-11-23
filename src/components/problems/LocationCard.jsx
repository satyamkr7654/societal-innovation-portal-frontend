import React from 'react';
import Card from '../ui/Card';
import LocationPicker from '../ui/LocationPicker';

/** Read-only map and address. */
export default function LocationCard({ problem }) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <span>📍</span> Geo-Tagged Location
          </h3>
          <span className="text-[11px] font-mono text-slate-500">{problem.district}</span>
        </div>
      }
      padding="none"
    >
      {/* Interactive Leaflet Map in ReadOnly Mode */}
      <LocationPicker value={problem.location || null} readOnly={true} height="240px" />

      <div className="p-4 space-y-2.5 text-xs border-t border-slate-200">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Civic Address
          </span>
          <p className="text-slate-800 font-medium leading-relaxed">
            {problem.location?.address || 'Address registered on map'}
          </p>
        </div>

        {problem.location?.lat && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-mono text-[11px] text-slate-500">
            <span>
              Lat: <strong className="text-slate-700">{problem.location.lat}</strong>
            </span>
            <span>
              Lng: <strong className="text-slate-700">{problem.location.lng}</strong>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
