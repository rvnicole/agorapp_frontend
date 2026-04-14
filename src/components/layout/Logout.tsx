import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { agorappApi } from "../../lib/agorappApi";
import { deleteToken } from "firebase/messaging";
import { messaging } from "../../api/firebase";
import { flushSync } from "react-dom";

type LogoutProps = {
    children: React.ReactNode;
    className?: string;
}

export default function Logout({ children, className }: LogoutProps) {
    const { setUserData } = useUserStore( state => state );
    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            localStorage.removeItem("userData");
            localStorage.removeItem("fb_token");

            const res = await deleteToken(messaging);
            console.log("token push eliminado", res);

            const { data } = await agorappApi.get("/logout");
            if( data.success ) {
                console.warn("Sesión cerrada");
            };
        }
        catch(error){
            if(error) console.error(error);
        }
        finally{
            flushSync(() => setUserData({
                email: "",
                nombre: "",
                apellido: "",
                alias: "",
                createdAt: "",
                esp: "",
                url_img: ""
            }));

            navigate("/auth/login");
        }
    };

    return (
        <button
            className={`flex items-center gap-2 cursor-pointer ${className}`}
            onClick={handleLogout}
        >
            {children}
        </button>
    )
}