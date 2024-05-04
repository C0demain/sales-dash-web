import { useEffect, useState } from 'react';
import { useAuth } from 'context/AuthProvider/useAuth';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface Props{
    children: JSX.Element;
    adminOnly?: boolean;
    sellerOnly?: boolean;
}

export const ProtectedLayout = ({ children,  adminOnly, sellerOnly}: Props) => {
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

    if (authLoading) {
        const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
        return <Spin indicator={antIcon} />;
    }

    //usuario nao autenticado pelo email volta para a tela de login
    if (!auth.email) {
        navigate('/login')
    }

    if (adminOnly && !auth.isAdmin()){
        navigate('/dashboardSeller')
    }

    if (sellerOnly && !auth.isSeller()){
        navigate('/dashboard')
    }

    return children;
};
