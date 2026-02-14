import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuthUser = () => {
    const user = useMemo(() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
        return jwtDecode(token);
        } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
        }
    }, []); // Empty dependency array means this will only run once when the hook is first used

    return user;
};