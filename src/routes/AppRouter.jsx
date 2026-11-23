import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layout Wrappers & Guards
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RootLayout from './RootLayout';
import RouteError from '../pages/RouteError';

// Public & Shared Pages
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

// Loaded when first opened, so visitors do not download every dashboard
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Notifications = lazy(() => import('../pages/Notifications'));
const PublicProblems = lazy(() => import('../pages/PublicProblems'));
const CitizenDashboard = lazy(() => import('../pages/citizen/CitizenDashboard'));
const SubmitProblem = lazy(() => import('../pages/citizen/SubmitProblem'));
const MyProblems = lazy(() => import('../pages/citizen/MyProblems'));
const ProblemDetail = lazy(() => import('../pages/problems/ProblemDetail'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ReviewProblems = lazy(() => import('../pages/admin/ReviewProblems'));
const AdminProblemDetail = lazy(() => import('../pages/admin/AdminProblemDetail'));
const Accounts = lazy(() => import('../pages/admin/Accounts'));
const UniversityDashboard = lazy(() => import('../pages/university/UniversityDashboard'));
const UniversityProblemDetail = lazy(
  () => import('../pages/university/UniversityProblemDetail')
);
const Assignments = lazy(() => import('../pages/university/Assignments'));
const Proposals = lazy(() => import('../pages/university/Proposals'));
const IndustryDashboard = lazy(() => import('../pages/industry/IndustryDashboard'));
const BrowseProposals = lazy(() => import('../pages/industry/BrowseProposals'));
const IndustryProblemDetail = lazy(
  () => import('../pages/industry/IndustryProblemDetail')
);
const MyPledges = lazy(() => import('../pages/industry/MyPledges'));

/**
 * Master Route Configuration with Role-Based Route Guards
 */
const routes = [
  // 1. PUBLIC LAYOUT ROUTES (Accessible to everyone)
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/problems',
        element: <PublicProblems />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      // 404 Catch-All Route
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },

  // 2. DASHBOARD LAYOUT ROUTES (Protected with Authentication & Role Guards)
  {
    // Level 1: the user must be signed in before any dashboard UI renders
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Level 2A: Citizen Only Routes
          {
            element: <ProtectedRoute allowedRoles={['citizen']} />,
            children: [
              {
                path: '/citizen/dashboard',
                element: <CitizenDashboard />,
              },
              {
                path: '/citizen/submit',
                element: <SubmitProblem />,
              },
              {
                path: '/citizen/problems',
                element: <MyProblems />,
              },
              {
                path: '/citizen/problems/:id',
                element: <ProblemDetail />,
              },
            ],
          },

          // Level 2B: Government Admin Only Routes
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              {
                path: '/admin/dashboard',
                element: <AdminDashboard />,
              },
              {
                path: '/admin/review',
                element: <ReviewProblems />,
              },
              { path: '/admin/problems/:id', element: <AdminProblemDetail /> },
              { path: '/admin/accounts', element: <Accounts /> },
            ],
          },

          // Level 2C: University Only Routes
          {
            element: <ProtectedRoute allowedRoles={['university']} />,
            children: [
              {
                path: '/university/dashboard',
                element: <UniversityDashboard />,
              },
              {
                path: '/university/assignments',
                element: <Assignments />,
              },
              {
                path: '/university/problems/:id',
                element: <UniversityProblemDetail />,
              },
              {
                path: '/university/proposals',
                element: <Proposals />,
              },
            ],
          },

          // Level 2D: Industry Only Routes
          {
            element: <ProtectedRoute allowedRoles={['industry']} />,
            children: [
              {
                path: '/industry/dashboard',
                element: <IndustryDashboard />,
              },
              {
                path: '/industry/proposals',
                element: <BrowseProposals />,
              },
              { path: '/industry/problems/:id', element: <IndustryProblemDetail /> },
              { path: '/industry/pledges', element: <MyPledges /> },
            ],
          },

          // Level 2E: Shared Authenticated Routes (Any valid logged-in role)
          {
            path: '/notifications',
            element: <Notifications />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter([
  { element: <RootLayout />, errorElement: <RouteError />, children: routes },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
