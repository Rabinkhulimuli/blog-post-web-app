/**
 * Routes configuration for the application.
 * This file defines the paths used throughout the application.
 * Each route is categorized for better organization.
 */
export const ROUTES = {
  HOME: '/',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: {
    BASE: '/dashboard',
    CREATE_POST:'/create/post',
    SETTINGS: '/dashboard/settings',
    POSTS:"/post/:id"
  },
  ERROR: {
    INTERNAL_SERVER_ERROR: '/500',
  },
} as const;
