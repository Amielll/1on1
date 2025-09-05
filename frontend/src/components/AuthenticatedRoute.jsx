import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../global_state/AuthProvider';

function AuthenticatedRoute() {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default AuthenticatedRoute;
