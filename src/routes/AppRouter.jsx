import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layout Wrappers & Guards
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RootLayout from './RootLayout';
import RouteError from '../pages/RouteError';

// Public & Shared Pages
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DesignSystemDemo from '../pages/DesignSystemDemo';
import Notifications from '../pages/Notifications';
import NotFound from '../pages/NotFound';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import SubmitProblem from '../pages/citizen/SubmitProblem';
import MyProblems from '../pages/citizen/MyProblems';
import ProblemDetail from '../pages/problems/ProblemDetail';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ReviewProblems from '../pages/admin/ReviewProblems';
import AdminProblemDetail from '../pages/admin/AdminProblemDetail';
import Accounts from '../pages/admin/Accounts';

// University Pages
import UniversityDashboard from '../pages/university/UniversityDashboard';
import Assignments from '../pages/university/Assignments';
import Proposals from '../pages/university/Proposals';

// Industry Pages
import IndustryDashboard from '../pages/industry/IndustryDashboard';
import BrowseProposals from '../pages/industry/BrowseProposals';

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
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/design-system',
        element: <DesignSystemDemo />,
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
