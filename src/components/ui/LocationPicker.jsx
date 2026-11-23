import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
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

// Moves the view without changing the pin
function MapFocus({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 11));
  }, [lat, lng, map]);
  return null;
}

/**
 * LocationPicker - Interactive Leaflet Map for Geo-Tagging Problems
 * Click-to-pin map with a coordinate display.
 *
 * @param {{ lat: number, lng: number } | null} value - Selected coordinate
 * @param {{ lat: number, lng: number } | null} focus - Where to move the view; never sets the pin
 * @param {function} onChange - Returns { lat, lng } to parent
 * @param {boolean} readOnly - Disables click editing (for problem view)
 * @param {string} height - Height of the map container
 */
export default function LocationPicker({
  value = null,
  focus = null,
  onChange,
  readOnly = false,
  height = '320px',
  className = '',
}) {
  // Ranchi, used only as a starting view
  const initialCenter = value || focus || { lat: 23.3441, lng: 85.3096 };

  const handleSelect = (coord) => {
    if (onChange) {
      onChange(coord);
    }
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {/* Map */}
      <div
        className="w-full rounded-lg overflow-hidden border border-slate-300 shadow-inner relative z-0"
        style={{ height }}
      >
        <MapContainer
          center={[initialCenter.lat, initialCenter.lng]}
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
          {focus && <MapFocus lat={focus.lat} lng={focus.lng} />}

          {/* Pinned Marker */}
          {value && (
            <Marker position={[value.lat, value.lng]}>
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-800">
                    {readOnly ? 'Problem Location' : 'Selected Location Pin'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Lat: {value.lat}, Lng: {value.lng}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating guidance overlay */}
        {!readOnly && !value && (
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
          {value ? (
            <div>
              <span className="font-bold text-slate-800">Location Tagged: </span>
              <span className="font-mono text-primary font-semibold">
                {value.lat.toFixed(5)}° N, {value.lng.toFixed(5)}° E
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic">
              No location selected yet. Click on the map to pin the incident site.
            </span>
          )}
        </div>

        {value && !readOnly && (
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
