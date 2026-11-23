import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix the classic Leaflet bundler asset resolution bug in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Inner component to capture user clicks and drop pins
function MapClickHandler({ onSelectLocation, readOnly }) {
  useMapEvents({
    click(e) {
      if (!readOnly && onSelectLocation) {
        onSelectLocation({
          lat: parseFloat(e.latlng.lat.toFixed(5)),
          lng: parseFloat(e.latlng.lng.toFixed(5)),
        });
      }
    },
  });
  return null;
}

// Inner helper to fly/re-center map when preset is clicked
function MapRecenter({ center }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

/**
 * LocationPicker - Interactive Leaflet Map for Geo-Tagging Problems
 * Centered on Jharkhand with click-to-pin, presets, and coordinate displays.
 *
 * @param {{ lat: number, lng: number } | null} value - Selected coordinate
 * @param {function} onChange - Returns { lat, lng } to parent
 * @param {boolean} readOnly - Disables click editing (for problem view)
 * @param {string} height - Height of the map container
 */
export default function LocationPicker({
  value = null,
  onChange,
  readOnly = false,
  height = '320px',
  className = '',
}) {
  // Default coordinates centered on Ranchi, Jharkhand
  const defaultJharkhandCenter = { lat: 23.3441, lng: 85.3096 };
  const currentCoord = value || (readOnly ? defaultJharkhandCenter : null);

  // Quick district presets for Jharkhand citizen convenience
  const districtPresets = [
    { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
    { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
    { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
    { name: 'Hazaribagh', lat: 23.9925, lng: 85.3637 },
  ];

  const handleSelect = (coord) => {
    if (onChange) {
      onChange(coord);
    }
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {/* Optional Preset Jump Buttons (Only shown in interactive mode) */}
      {!readOnly && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Quick District Jump:
          </span>
          {districtPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelect({ lat: preset.lat, lng: preset.lng })}
              className="px-2 py-0.5 bg-slate-100 hover:bg-primary/10 hover:text-primary border border-slate-200 rounded text-[11px] font-medium text-slate-600 transition shrink-0 cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}

      {/* Map Container Container */}
      <div
        className="w-full rounded-lg overflow-hidden border border-slate-300 shadow-inner relative z-0"
        style={{ height }}
      >
        <MapContainer
          center={[defaultJharkhandCenter.lat, defaultJharkhandCenter.lng]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Event Listeners */}
          <MapClickHandler onSelectLocation={handleSelect} readOnly={readOnly} />
          {currentCoord && <MapRecenter center={currentCoord} />}

          {/* Pinned Marker */}
          {currentCoord && (
            <Marker position={[currentCoord.lat, currentCoord.lng]}>
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-800">
                    {readOnly ? 'Problem Location' : 'Selected Location Pin'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Lat: {currentCoord.lat}, Lng: {currentCoord.lng}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Verified in Jharkhand territory
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating guidance overlay */}
        {!readOnly && !currentCoord && (
          <div className="absolute top-2.5 right-2.5 z-40 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-md shadow-sm border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Click anywhere on map to drop location pin</span>
          </div>
        )}
      </div>

      {/* Selected Coordinates Readout Card */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">📍</span>
          {currentCoord ? (
            <div>
              <span className="font-bold text-slate-800">Location Tagged: </span>
              <span className="font-mono text-primary font-semibold">
                {currentCoord.lat.toFixed(5)}° N, {currentCoord.lng.toFixed(5)}° E
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic">
              No location selected yet. Click on the map to pin the incident site.
            </span>
          )}
        </div>

        {currentCoord && !readOnly && (
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
          >
            Clear Pin
          </button>
        )}
      </div>
    </div>
  );
}
