// Hook to track page visits automatically
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackVisit } from '../services/analyticsService.js';

export function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);
}