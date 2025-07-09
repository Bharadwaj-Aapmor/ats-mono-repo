import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RouteGuardContext from './RouteGuardContext';

const RouteGuardProvider = ({ children }) => {
    const location = useLocation();
    const previousPathRef = useRef(null);
    const [previousPath, setPreviousPath] = useState(null);

    useEffect(() => {
        setPreviousPath(previousPathRef.current);
        previousPathRef.current = location.pathname;
    }, [location]);

    return (
        <RouteGuardContext.Provider value={{ previousPath }}>
            {children}
        </RouteGuardContext.Provider>
    );
};

export default RouteGuardProvider;
