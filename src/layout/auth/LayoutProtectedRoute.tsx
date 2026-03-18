import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

export default function ProtectedRoute(){
    const { getUserFromStore, getUserFromStorage } = useUser();
    if( getUserFromStore() || getUserFromStorage() ) return <Outlet/>
    return <Navigate to="/auth/login" />;
};