import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../services/analytics';

export const AnalyticsTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        logPageView();
    }, [location]);

    return null;
};
