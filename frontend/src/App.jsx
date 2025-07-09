import React, { useEffect, useContext } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import routes from './configs/routesConfig';
import ProtectedRoute from "./components/ProtectedRoutes";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import UserContext from "./context/UserContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (location.pathname.startsWith('/callback/login')) return;

    const token = Cookies.get('token');
    try {
      if (!token) throw new Error('No token');
      const decoded = jwtDecode(token);
      setUser({
        name: decoded.FullName,
        email: decoded.Email,
        role: decoded.Department,
        access: decoded.Access || []
      });
      if (location.pathname === '/') {
        navigate('/home');
      }
    } catch (err) {
      console.warn('Token invalid or missing:', err.message);
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        {/* {routes.map(({ path, element, requiredAccess }, index) => { */}
        {
          routes.map(({ path, element, requiredAccess }, index) => {
            // const hasAccess = Array.isArray(requiredAccess) && requiredAccess.length > 0;

            return (
              <Route
                key={index}
                path={path}
                element={
                  // hasAccess ? (
                  // <ProtectedRoute
                  // requiredAccess={requiredAccess}
                  // >
                  // { 
                  element

                  // }
                  // </ProtectedRoute>
                  // ) : (
                  // element
                  // )
                }
              />
            );
          })
        }
      </Routes>
    </div>
  );
}

export default App;
