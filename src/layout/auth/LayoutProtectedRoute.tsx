import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

export default function ProtectedRoute(){
    const { getUserFromStore, getUserFromStorage } = useUser();

    if( getUserFromStore() || getUserFromStorage() ) {
        console.log(`Desde appstore`, { store: getUserFromStore(), storage: getUserFromStorage() });
        return <Outlet/>
    }
    else{
        return <Navigate to="/auth/login" />
    };
};