import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import App from '@/app';
import { NotFound } from '@/app/not-found';
import { AuthRedirect } from '@/components/guards/auth-redirect-route';
import { ProtectedRoute } from '@/components/guards/protected-route';
import { withSuspense } from '@/components/layouts/with-suspense';
import { ROUTES } from '@/configs/routes';
import { AuthLayout } from '@/features/auth';
import { DashboardLayout } from '@/features/dashboard';

import { ErrorFallback } from '../error-fallback';
import AuthCardLogin from '@/features/auth/pages/auth-card-login';
import AuthCardRegister from '@/features/auth/pages/auth-card-register';

// Auth

const CreatePostPage =lazy(()=> import('@/features/blog-post/components/create-post-page'))
const  Dashboard = lazy(()=> import('@/features/blog-dashboard'))
const  PostDetailPage = lazy(()=> import('@/features/blog'))

// UnAuth
const LandingPage = lazy(() => import('@/features/landing-page/index'));
export const router = createBrowserRouter([
  {
    // Root route
    Component: App,
    ErrorBoundary: ErrorFallback,

    children: [
      // Site routes ( Public / Unprotected )
      { path: ROUTES.HOME, element: withSuspense(LandingPage) },

      // Auth routes
      {
        Component: AuthRedirect,
        children: [
          {
            Component: AuthLayout,
            children: [
              { path: ROUTES.AUTH.BASE, element: <Navigate replace to={ROUTES.AUTH.LOGIN} /> },
              { path: ROUTES.AUTH.LOGIN, element: <AuthCardLogin/> },
              { path: ROUTES.AUTH.REGISTER, element: <AuthCardRegister/> },
            ],
          },
        ],
      },

      // Protected routes
      {
        Component: ProtectedRoute,
        children: [
          // Dashboard Routes
          {
            Component: DashboardLayout,
            children: [
              { path: ROUTES.DASHBOARD.BASE, element: withSuspense(Dashboard) },
              { path: ROUTES.DASHBOARD.CREATE_POST, element: withSuspense(CreatePostPage) },
              { path: ROUTES.DASHBOARD.POSTS, element: withSuspense(PostDetailPage) },

              // Catch-all for dashboard routes
              {
                path: `${ROUTES.DASHBOARD.BASE}/*`,
                element: <NotFound showBackgroundGlow={false} />,
              },
            ],
          },

        ],
      },

      // Catch-all route for unmatched routes
      { path: '*', element: <NotFound className='min-h-screen' /> },
    ],
  },
]);
