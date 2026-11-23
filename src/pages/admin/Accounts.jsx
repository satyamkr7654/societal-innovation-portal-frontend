import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import LoadState from '../../components/ui/LoadState';
import { useAsync } from '../../hooks/useAsync';
import { decideAccount, listPendingAccounts } from '../../services/adminService';

const ROLE_LABELS = { university: 'University', industry: 'Industry' };

export default function Accounts() {
  const {
    data: accounts,
    error,
    isLoading,
    reload,
    setData,
  } = useAsync(listPendingAccounts);
  const [pendingId, setPendingId] = useState(null);
  const [decisionError, setDecisionError] = useState('');

  const decide = async (account, approve) => {
    const question = approve
      ? `Approve ${account.organizationName}? ${account.name} will be able to sign in.`
      : `Reject ${account.organizationName}? This cannot be undone.`;
    if (!window.confirm(question)) return;
    setDecisionError('');
    setPendingId(account.id);
    try {
      await decideAccount(account.id, approve);
      setData(accounts.filter((a) => a.id !== account.id));
    } catch (err) {
      setDecisionError(err.message);
    } finally {
      setPendingId(null);
    }
  };

  if (isLoading || error) return <LoadState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Account Approvals
        </h2>
        <p className="text-sm text-slate-500">
          Universities and companies cannot sign in until you approve them. Confirm that
          the person really represents the organisation first.
        </p>
      </div>

      {decisionError && (
        <p role="alert" className="text-sm text-red-600 font-medium">
          {decisionError}
        </p>
      )}

      {accounts.length === 0 ? (
        <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No accounts are waiting for approval.
        </p>
      ) : (
        <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {accounts.map((a) => (
            <li
              key={a.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-slate-900 break-words">
                  {a.organizationName}
                </p>
                <p className="text-xs text-slate-500 break-words">
                  {ROLE_LABELS[a.role]} • {a.name} • {a.email} • registered{' '}
                  {new Date(a.registeredAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  disabled={pendingId !== null}
                  onClick={() => decide(a, true)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={pendingId !== null}
                  onClick={() => decide(a, false)}
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
