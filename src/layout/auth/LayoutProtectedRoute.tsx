import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useUserStore } from "../../store/userStore";

export default function ProtectedRoute(){
    const { setUserData } = useUserStore();
    const { getUserFromStore, getUserFromStorage } = useUser();
    if( !getUserFromStore() ) {
        const userStorage = getUserFromStorage();
        if( userStorage ){
            setUserData(userStorage);
        }
        else{
            return <Navigate to="/auth/login" />;
        }
    };
    return <Outlet/>;
};