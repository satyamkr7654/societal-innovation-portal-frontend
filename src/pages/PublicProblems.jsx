import React, { useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import Badge from '../components/ui/Badge';
import LoadState from '../components/ui/LoadState';
import { CIVIC_CATEGORIES } from '../constants/categories';
import { STATUS_MARKERS } from '../constants/mapColors';
import { STATUS_CONFIG } from '../constants/statusConfig';
import { useAsync } from '../hooks/useAsync';
import { listPublicProblems } from '../services/publicService';

const JHARKHAND_CENTER = [23.65, 85.6];
const NO_PROBLEMS = [];
const selectClass =
  'w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500';

export default function PublicProblems() {
  const { data, error, isLoading, reload } = useAsync(listPublicProblems);
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [district, setDistrict] = useState('ALL');
  const problems = data || NO_PROBLEMS;

  const shown = useMemo(
    () =>
      problems.filter(
        (p) =>
          (status === 'ALL' || p.status === status) &&
          (category === 'ALL' || p.category === category) &&
          (district === 'ALL' || p.district === district)
      ),
    [problems, status, category, district]
  );
  const districts = [...new Set(problems.map((p) => p.district))].sort();

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-900">
          Public Problems
        </h1>
        <p className="text-sm text-slate-600">
          Verified problems across Jharkhand. Locations are approximate (about 1 km).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All statuses</option>
          {Object.keys(STATUS_MARKERS).map((key) => (
            <option key={key} value={key}>
              {STATUS_CONFIG[key].display}
            </option>
          ))}
        </select>
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All categories</option>
          {CIVIC_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          aria-label="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All districts</option>
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="relative z-0 h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200">
        <MapContainer
          center={JHARKHAND_CENTER}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {shown.map((p) => (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={9}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: STATUS_MARKERS[p.status],
                fillOpacity: 1,
              }}
            >
              <Popup>
                <strong>{p.title}</strong>
                <br />
                {p.category} • {p.district} • {STATUS_CONFIG[p.status].display}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <ul className="flex flex-wrap gap-4 text-xs text-slate-600">
        {Object.entries(STATUS_MARKERS).map(([key, color]) => (
          <li key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            {STATUS_CONFIG[key].display}
          </li>
        ))}
      </ul>

      {shown.length === 0 ? (
        <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No verified problems match.
        </p>
      ) : (
        <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {shown.map((p) => (
            <li
              key={p.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 break-words">
                  {p.title}
                </p>
                <p className="text-xs text-slate-500">
                  {p.category} • {p.district}
                </p>
              </div>
              <span className="shrink-0">
                <Badge status={p.status} size="sm" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
