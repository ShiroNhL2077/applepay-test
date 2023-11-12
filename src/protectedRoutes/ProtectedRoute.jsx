import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAdmin, isAuthenticated, loading } = useSelector((state) => state.user)

    return (
        <>
            {loading === false && (
                isAuthenticated === false ? <Navigate to="/" /> : isAdmin ? children :<Navigate to="/" />
            )}
        </>
    );
};

export default ProtectedRoute;
