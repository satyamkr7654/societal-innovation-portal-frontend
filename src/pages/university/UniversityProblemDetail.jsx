import React from 'react';
import UniversityActions from '../../components/university/UniversityActions';
import ProblemDetail from '../problems/ProblemDetail';

export default function UniversityProblemDetail() {
  return (
    <ProblemDetail
      listPath="/university/assignments"
      listLabel="Assigned Problems"
      Actions={UniversityActions}
    />
  );
}
