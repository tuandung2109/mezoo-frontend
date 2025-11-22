export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mezoo-backend.onrender.com/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'mezoo';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  SERIES: '/series',
  MY_LIST: '/my-list',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
};

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  VIP: 'vip',
};

export const VIDEO_QUALITIES = ['480p', '720p', '1080p', '4k'];
