import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LocationPicker from '../../components/ui/LocationPicker';
import StatusStepper from '../../components/ui/StatusStepper';
import { getProblemById, saveProblemFeedback, CIVIC_CATEGORIES } from '../../utils/mockData';
import { getStatusConfig } from '../../utils/statusConfig';

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Feedback form state for SOLVED problems
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackRemarks, setFeedbackRemarks] = useState('');
  const [isVerifiedOnGround, setIsVerifiedOnGround] = useState(true);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState('');

  // Image modal preview state
  const [showImageModal, setShowImageModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Fetch problem record by route param ID
    const found = getProblemById(id);
    setProblem(found || null);
    setIsLoading(false);
  }, [id]);

  const handleCopyId = () => {
    if (problem?.id) {
      navigator.clipboard.writeText(problem.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!problem) return;

    setIsSubmittingFeedback(true);
    const feedbackPayload = {
      rating,
      remarks: feedbackRemarks.trim() || 'Citizen confirmed resolution quality.',
      verifiedOnGround: isVerifiedOnGround,
      citizenName: problem.citizen?.name || 'Citizen',
    };

    const updated = saveProblemFeedback(problem.id, feedbackPayload);
    setTimeout(() => {
      setProblem(updated);
      setIsSubmittingFeedback(false);
      setFeedbackSuccessMsg('Thank you! Your resolution satisfaction feedback has been recorded.');
      setTimeout(() => setFeedbackSuccessMsg(''), 5000);
    }, 400);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500">Loading problem dossier...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto">
          ⚠️
        </div>
        <h2 className="text-xl font-heading font-bold text-slate-900">
          Problem Record Not Found
        </h2>
        <p className="text-sm text-slate-500">
          No grievance matches Case ID <code className="font-mono font-bold text-slate-700">{id}</code>. It may have been archived or removed.
        </p>
        <Link to="/citizen/problems">
          <Button variant="primary" size="sm">
            &larr; Back to My Problems
          </Button>
        </Link>
      </div>
    );
  }

  const categoryMeta = CIVIC_CATEGORIES.find((c) => c.id === problem.category);
  const statusMeta = getStatusConfig(problem.status);
  const isSolved = problem.status === 'SOLVED';
  const hasFeedback = Boolean(problem.feedback);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/citizen/problems"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-900 hover:underline transition"
        >
          <span>&larr;</span> Back to My Reported Problems
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyId}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition flex items-center gap-1"
          >
            <span>{copiedId ? '✓ Copied' : '📋 Copy ID'}</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black tracking-wide px-2.5 py-0.5 bg-primary-50 text-primary-800 rounded border border-primary-200">
                CASE #{problem.id}
              </span>
              <Badge status={problem.status} size="md" />
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                <span>{categoryMeta?.icon || '📌'}</span>
                <span>{categoryMeta?.id || problem.category}</span>
              </span>
              {problem.district && (
                <span className="text-xs text-slate-600 font-medium">
                  📍 {problem.district}, Jharkhand
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight leading-snug">
              {problem.title}
            </h1>
          </div>

          <div className="text-left md:text-right shrink-0 text-xs text-slate-500 space-y-1">
            <div>
              Lodged On:{' '}
              <strong className="text-slate-800">
                {new Date(problem.submittedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
            </div>
            <div>
              Citizen Reporter:{' '}
              <strong className="text-slate-800">{problem.citizen?.name || 'Verified Citizen'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Stage Lifecycle Stepper Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Lifecycle Milestone Progression
          </h2>
          <span className="text-xs text-slate-400">SIH26043 Civic Workflow</span>
        </div>
        <StatusStepper
          currentStatus={problem.status}
          statusHistory={problem.statusHistory || []}
          rejectionReason={problem.rejectionReason}
        />
      </div>

      {/* Split Dossier Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols wide on desktop): Problem Description, Photo, History Timeline & Feedback */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Problem Description Card */}
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
                    <div
                      onClick={() => setShowImageModal(true)}
                      className="relative rounded-lg overflow-hidden border border-slate-200 cursor-pointer group max-h-80 bg-slate-900"
                    >
                      <img
                        src={problem.photoUrl}
                        alt="On site grievance evidence"
                        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <span>🔍 Click to View Full Image</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      Uploaded by citizen during grievance lodgement. Verified by AI-free manual nodal inspection.
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

          {/* Audit History Timeline Card */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>📜</span> Lifecycle Audit Log &amp; Officer Notes
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {problem.statusHistory?.length || 0} entries
                </span>
              </div>
            }
          >
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(problem.statusHistory || []).map((entry, index) => {
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

          {/* Citizen Resolution Feedback Section (Shown when Solved or Feedback already logged) */}
          {(isSolved || hasFeedback) && (
            <Card
              id="feedback"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>⭐</span> Citizen Satisfaction &amp; On-Ground Feedback
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Post-Resolution Review
                  </span>
                </div>
              }
            >
              {feedbackSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
                  <span>✓</span> {feedbackSuccessMsg}
                </div>
              )}

              {problem.feedback ? (
                /* Already Submitted Feedback Display */
                <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= problem.feedback.rating ? 'text-amber-500' : 'text-slate-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1.5">
                        {problem.feedback.rating} out of 5 Stars
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      Submitted on{' '}
                      {new Date(problem.feedback.submittedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic bg-white p-3 rounded-lg border border-emerald-100">
                    "{problem.feedback.remarks || problem.feedback.comment}"
                  </p>

                  <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                    <span>✅</span> Citizen verified that the solution is functioning on-ground.
                  </div>
                </div>
              ) : (
                /* Interactive Feedback Form */
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    The engineering solution formulated by the assigned university team has been deployed. Please provide your candid feedback on the quality, durability, and on-ground effectiveness of the resolution.
                  </p>

                  {/* Star Rating Control */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Overall Resolution Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 text-2xl transition hover:scale-110 focus:outline-none"
                        >
                          <span
                            className={
                              (hoverRating || rating) >= star
                                ? 'text-amber-500'
                                : 'text-slate-300'
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {rating === 5
                          ? '5 - Excellent resolution'
                          : rating === 4
                          ? '4 - Good quality'
                          : rating === 3
                          ? '3 - Average / Adequate'
                          : rating === 2
                          ? '2 - Needs improvement'
                          : '1 - Poor resolution'}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Citizen Feedback &amp; Field Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackRemarks}
                      onChange={(e) => setFeedbackRemarks(e.target.value)}
                      placeholder="Share details on how well the water pipeline / drainage / road was restored, timeliness of the student innovation team, etc."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-800"
                    />
                  </div>

                  {/* Ground Verification Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isVerifiedOnGround}
                      onChange={(e) => setIsVerifiedOnGround(e.target.checked)}
                      className="mt-0.5 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>
                      I solemnly confirm as a citizen that I have inspected the on-ground site and this feedback accurately reflects the local situation.
                    </span>
                  </label>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmittingFeedback}
                    className="shadow-sm"
                  >
                    {isSubmittingFeedback ? 'Recording Feedback...' : 'Submit Citizen Feedback'}
                  </Button>
                </form>
              )}
            </Card>
          )}
        </div>

        {/* Right Column (1 Col wide): Geotagged Map, University R&D Assignee, Industry Sponsor */}
        <div className="space-y-6">
          {/* Leaflet GPS Geotagged Map Card */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>📍</span> Geo-Tagged Location
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {problem.district}
                </span>
              </div>
            }
            padding="none"
          >
            {/* Interactive Leaflet Map in ReadOnly Mode */}
            <LocationPicker
              value={problem.location || { lat: 23.3441, lng: 85.3096 }}
              readOnly={true}
              height="240px"
            />

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

          {/* Assigned University Innovation Lab Card */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>🏛️</span> University R&amp;D Assignee
                </h3>
                <Badge
                  status={problem.assignedUniversity ? 'assigned' : 'submitted'}
                  size="sm"
                />
              </div>
            }
          >
            {problem.assignedUniversity ? (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm">
                    {problem.assignedUniversity.name}
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {problem.assignedUniversity.department}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Faculty Lead:</span>
                    <strong className="text-slate-900">
                      {problem.assignedUniversity.facultyLead || 'Assigned Faculty'}
                    </strong>
                  </div>

                  {problem.assignedUniversity.studentsCount && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Student Researchers:</span>
                      <strong className="text-slate-900">
                        {problem.assignedUniversity.studentsCount} Students Enrolled
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-500">
                <p>
                  This problem has not yet been assigned to a university innovation cell.
                </p>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                  Government nodal officers review submitted grievances and match them with Jharkhand university departments (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, etc.).
                </div>
              </div>
            )}
          </Card>

          {/* Industry CSR Sponsorship Card */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>💼</span> Industry / CSR Partner
                </h3>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Funding &amp; Hardware
                </span>
              </div>
            }
          >
            {problem.industrySupport?.sponsor ? (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm">
                    {problem.industrySupport.sponsor}
                  </h4>
                  <p className="text-emerald-700 font-semibold text-xs mt-0.5">
                    Funding Pledged: {problem.industrySupport.amount}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Sponsorship Scope
                  </span>
                  <p className="mt-0.5 text-slate-800">
                    {problem.industrySupport.type}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-500">
                <p>
                  No private sector or CSR sponsor has adopted this research proposal yet.
                </p>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                  Corporates like Tata Steel, Coal India, and JSPL browse vetted academic proposals in their dashboard to fund prototyping costs.
                </div>
              </div>
            )}
          </Card>

          {/* Citizen Reporter Card */}
          <Card
            header={
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span>👤</span> Lodging Citizen Details
              </h3>
            }
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Name:</span>
                <strong className="text-slate-900">{problem.citizen?.name || 'Citizen'}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Mobile Contact:</span>
                <span className="font-mono text-slate-700">
                  {problem.citizen?.phone ? `+91 ${problem.citizen.phone.slice(0, 5)}*****` : 'Confidential'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Identity Status:</span>
                <span className="text-emerald-700 font-semibold">✓ Verified Citizen</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* High-Res Photo Lightbox Modal */}
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
    </div>
  );
}
