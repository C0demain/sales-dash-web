import { useEffect, useState } from 'react';
import { useAuth } from 'context/AuthProvider/useAuth';
import { useNavigate } from 'react-router-dom';

interface Props {
    children: JSX.Element;
    adminOnly?: boolean;
    sellerOnly?: boolean;
}

export const ProtectedLayout = ({ children, adminOnly, sellerOnly }: Props) => {
    const auth = useAuth();
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.loading) {
            const timer = setTimeout(() => {
                setAuthLoading(false);
            }, 1000); 
            return () => clearTimeout(timer);
        } else {
            setAuthLoading(false);
        }
    }, [auth.loading]);

    useEffect(() => {
        if (!authLoading) {
            if (!auth.email) {
                navigate('/login');
            } else if (adminOnly && !auth.isAdmin()) {
                navigate('/dashboardSeller');
            } else if (sellerOnly && !auth.isSeller()) {
                navigate('/dashboard');
            }
        }
    }, [authLoading, auth, navigate, adminOnly, sellerOnly]);

    if (authLoading) {
        return null; // Return nothing while loading
    }

    // Ensure that the children are only rendered if the auth checks pass
    if (!auth.email || (adminOnly && !auth.isAdmin()) || (sellerOnly && !auth.isSeller())) {
        return null; // or return a fallback UI
    }

    return children;
};
