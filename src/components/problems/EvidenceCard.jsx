import React, { useState } from 'react';
import Card from '../ui/Card';

/** Description and photo, with a full-size photo view. */
export default function EvidenceCard({ problem }) {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <Card
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>📄</span> Grievance Dossier &amp; Ground Evidence
            </h3>
            <span className="text-xs text-slate-500">Public Record</span>
          </div>
        }
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Detailed Statement of Problem
            </h4>
            <p className="leading-relaxed whitespace-pre-line text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
              {problem.description}
            </p>
          </div>

          {/* Photo Evidence Gallery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              On-Site Photographic Evidence
            </h4>
            {problem.photoUrl ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="relative block w-full rounded-lg overflow-hidden border border-slate-200 cursor-pointer group max-h-80 bg-slate-900"
                >
                  <img
                    src={problem.photoUrl}
                    alt="On site grievance evidence"
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <span>🔍 Click to View Full Image</span>
                  </div>
                </button>
                <p className="text-[11px] text-slate-500 italic">
                  Uploaded by the citizen with this report.
                </p>
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50 text-slate-400 text-xs">
                📷 No photo was attached at the time of lodging this problem.
              </div>
            )}
          </div>
        </div>
      </Card>
      {showImageModal && problem.photoUrl && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h4 className="font-heading font-bold text-sm text-slate-800">
                Case #{problem.id} — Photographic Evidence
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-900 flex items-center justify-center">
              <img
                src={problem.photoUrl}
                alt="Enlarged grievance evidence"
                className="max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
