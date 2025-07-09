import { Navigate } from "react-router-dom";
import UserContext from '../context/UserContext';
import { useContext } from "react";
import RouteGuardContext from '../context/RouteGuardContext';

export default function ProtectedRoute({ children, requiredAccess = [], allowedPreviousPaths = [] }) {
    const userContext = useContext(UserContext);
    const user = userContext && userContext.user ? userContext.user : userContext;

    const routeGuard = useContext(RouteGuardContext);
    const previousPath = routeGuard ? routeGuard.previousPath : null;
    console.log(previousPath)

    //   if (loading) return <div>Loading...</div>;

    if (!user || !user.email) {
        return <Navigate to="/login" replace />;
    }



    const hasAccess = requiredAccess.some(tag => user.access.includes(tag));
    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }
    // Fix: Only enforce allowedPreviousPaths if previousPath is set (not null/undefined)
    const hasNavigationPermission =
        allowedPreviousPaths.length === 0 ||
        previousPath == null || // allow if previousPath is not set (e.g., on refresh)
        allowedPreviousPaths.includes(previousPath);
    if (!hasNavigationPermission) return <Navigate to="/upload" />;


    return children;
}
