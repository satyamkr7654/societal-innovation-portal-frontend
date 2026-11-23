import React from 'react';
import Card from '../ui/Card';
import { getStatusConfig } from '../../constants/statusConfig';

/** Every status change, oldest first. */
export default function AuditTimeline({ history }) {
  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>📜</span> Lifecycle Audit Log &amp; Officer Notes
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {history.length} entries
          </span>
        </div>
      }
    >
      <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {history.map((entry, index) => {
          const stageConfig = getStatusConfig(entry.stage);
          return (
            <div key={index} className="flex items-start gap-4 relative">
              {/* Timeline Node Dot */}
              <div className="w-6 h-6 rounded-full bg-white border-2 border-primary-600 flex items-center justify-center shrink-0 z-10 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-primary-700" />
              </div>

              {/* Entry Details */}
              <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${stageConfig.bgColor} ${stageConfig.textColor} ${stageConfig.borderColor}`}
                    >
                      {stageConfig.display}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      By {entry.changedBy}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(entry.changedAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {entry.remarks}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
