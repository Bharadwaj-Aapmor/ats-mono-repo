import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Loader from '../helpers/Loader';

// 1. Create the context
const UserContext = createContext({
    user: { name: '', email: '', role: '', access: [] },
    setUser: () => { },
    loading: true
});

// 2. Provider component
export function UserProvider({ children }) {
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
                if (token) {
                    const decoded = jwtDecode(token);
                    if (decoded) {
                        setUser({
                            name: decoded.FullName,
                            email: decoded.Email,
                            role: decoded.Department,
                            access: decoded.Access || []
                        });
                    }
                }
            } catch (err) {
                console.log('Token is invalid or not present');
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

// 3. Custom hook
export function useUser() {
    return useContext(UserContext);
}

export default UserContext;
