import { useState, useEffect } from 'react';
import UserContext from './UserContext';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Loader from '../helpers/Loader';

export default function UserProvider({ children }) {
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        access: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = () => {
            try {
                const token = Cookies.get('token');
                if (!token) throw new Error("No token");

                const decoded = jwtDecode(token);

                setUser({
                    name: decoded.FullName,
                    email: decoded.Email,
                    role: decoded.Department,
                    access: decoded.Access || []
                });
            } catch (err) {
                console.log('User not logged in or token invalid:', err.message);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (loading) return <Loader />;

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
