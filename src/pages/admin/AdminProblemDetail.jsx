import React from 'react';
import ReviewActions from '../../components/admin/ReviewActions';
import ProblemDetail from '../problems/ProblemDetail';

export default function AdminProblemDetail() {
  return (
    <ProblemDetail
      listPath="/admin/review"
      listLabel="Review Problems"
      Actions={ReviewActions}
    />
  );
}
