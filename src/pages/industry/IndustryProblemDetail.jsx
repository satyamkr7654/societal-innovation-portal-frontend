import React from 'react';
import IndustryActions from '../../components/industry/IndustryActions';
import ProblemDetail from '../problems/ProblemDetail';

export default function IndustryProblemDetail() {
  return (
    <ProblemDetail
      listPath="/industry/proposals"
      listLabel="Browse Proposals"
      Actions={IndustryActions}
    />
  );
}
