import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layout Wrappers
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

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
import ProblemDetail from '../pages/citizen/ProblemDetail';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ReviewProblems from '../pages/admin/ReviewProblems';

// University Pages
import UniversityDashboard from '../pages/university/UniversityDashboard';
import Assignments from '../pages/university/Assignments';
import Proposals from '../pages/university/Proposals';

// Industry Pages
import IndustryDashboard from '../pages/industry/IndustryDashboard';
import BrowseProposals from '../pages/industry/BrowseProposals';

/**
 * Master Route Configuration
 * Structures all public and authenticated role routes with nested layouts
 * and a 404 catch-all route.
 */
const router = createBrowserRouter([
  // 1. PUBLIC LAYOUT ROUTES (Navbar + Content + Footer)
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
      // 404 Catch-All within Public Layout
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },

  // 2. DASHBOARD LAYOUT ROUTES (Role-aware Sidebar + Mini-Header + Content)
  {
    element: <DashboardLayout />,
    children: [
      // Citizen Routes
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

      // Admin Routes
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
      },
      {
        path: '/admin/review',
        element: <ReviewProblems />,
      },

      // University Routes
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

      // Industry Routes
      {
        path: '/industry/dashboard',
        element: <IndustryDashboard />,
      },
      {
        path: '/industry/proposals',
        element: <BrowseProposals />,
      },

      // Shared Authenticated Routes
      {
        path: '/notifications',
        element: <Notifications />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
