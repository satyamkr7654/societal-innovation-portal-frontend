import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { submitFeedback } from '../../services/problemService';

/** Shows submitted feedback, or the form when the viewer reported the problem. */
export default function FeedbackCard({ problem, isOwner, onSaved }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [isVerifiedOnGround, setIsVerifiedOnGround] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { feedback } = problem;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (rating === 0) {
      setError('Please choose a star rating.');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await submitFeedback(problem.id, {
        rating,
        remarks: remarks.trim() || null,
        verifiedOnGround: isVerifiedOnGround,
      });
      setSuccessMsg('Thank you! Your feedback has been recorded.');
      onSaved(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      id="feedback"
      className="scroll-mt-20"
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
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
          <span>✓</span> {successMsg}
        </div>
      )}

      {feedback ? (
        /* Already Submitted Feedback Display */
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= feedback.rating ? 'text-amber-500' : 'text-slate-300'
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-1.5">
                {feedback.rating} out of 5 Stars
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Submitted on{' '}
              {new Date(feedback.submittedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {(feedback.remarks || feedback.comment) && (
            <p className="text-xs sm:text-sm text-slate-700 italic bg-white p-3 rounded-lg border border-emerald-100">
              &quot;{feedback.remarks || feedback.comment}&quot;
            </p>
          )}

          {feedback.verifiedOnGround === true && (
            <div className="text-xs text-emerald-800 font-medium">
              ✅ The citizen confirmed inspecting the site.
            </div>
          )}
          {feedback.verifiedOnGround === false && (
            <div className="text-xs text-slate-600 font-medium">
              The citizen did not confirm an on-site inspection.
            </div>
          )}
        </div>
      ) : !isOwner ? (
        <p className="text-xs text-slate-600">
          Only the citizen who reported this problem can submit feedback.
        </p>
      ) : (
        /* Interactive Feedback Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            The engineering solution formulated by the assigned university team has been
            deployed. Please provide your candid feedback on the quality, durability, and
            on-ground effectiveness of the resolution.
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
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  aria-pressed={rating === star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition hover:scale-110 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
                {rating === 0
                  ? 'Select a rating'
                  : rating === 5
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
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
              I solemnly confirm as a citizen that I have inspected the on-ground site and
              this feedback accurately reflects the local situation.
            </span>
          </label>

          {error && (
            <p role="alert" className="text-xs text-red-600 font-medium">
              {error}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isSaving}
            variant="primary"
            size="sm"
            className="shadow-sm"
          >
            Submit Citizen Feedback
          </Button>
        </form>
      )}
    </Card>
  );
}
