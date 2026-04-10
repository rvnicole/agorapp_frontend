import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { agorappApi } from "../../lib/agorappApi";
import { deleteToken } from "firebase/messaging";
import { messaging } from "../../api/firebase";
import { flushSync } from "react-dom";
import { LogOut } from "lucide-react";

type LogoutProps = {
    className: string;
}

export default function Logout({ className }: LogoutProps) {
    const { setUserData } = useUserStore( state => state );
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("fb_token");

        const res = await deleteToken(messaging);
        console.log("token push eliminado", res);

        const { data } = await agorappApi.get("/logout");
        if( data.success ) {
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
            className={`flex items-center gap-2 w-full p-2 cursor-pointer hover:bg-muted ${className}`}
            onClick={handleLogout}
        >
            <LogOut className="h-5 w-5"/>
            <span>Cerrar sesión</span>
        </button>
    )
}