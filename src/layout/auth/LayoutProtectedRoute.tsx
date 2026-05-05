import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useUserStore } from "../../store/userStore";

export default function ProtectedRoute(){
    const location = useLocation();
    const { setUserData } = useUserStore();
    const { getUserFromStore, getUserFromStorage } = useUser();
    const searchParams = new URLSearchParams(location.search);
    const publicPost = searchParams.get("public");
    console.log("Ddesde protected", { searchParams, publicPost, location: location.search });

    if( !getUserFromStore() ) {
        const userStorage = getUserFromStorage();
        
        if( userStorage ){
            setUserData(userStorage);
        }
        else if( !userStorage && !publicPost ){
            return <Navigate to="/auth/login" />;
        }
        else if( !userStorage && publicPost ){
            const url = location.pathname + location.search;
            const formatUrl = url.replace("reporte", "public");
            console.log("Desde la publicacion publica", formatUrl);
            return <Navigate to={formatUrl} />
        }
        else if( userStorage && publicPost  ){
            console.log("Publicacion normal", location.pathname);
            return <Navigate to={location.pathname} />;
        };
    };
    return <Outlet/>;
};