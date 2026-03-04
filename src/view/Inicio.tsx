import { useNavigate } from "react-router-dom";
import { agorappApi } from "../lib/agorappApi";
import { useUserStore } from "../store/userStore";

export default function Inicio() {
    const { setUserData } =  useUserStore();

    // ESTO ES UNA PRUEBA PARA CONTROLAR EL CIERRE DE SESION 
    const navigate = useNavigate();
    const handleLogout = async () => {
        const { data } = await agorappApi.get("/logout");
        if( data.success ) {
            console.log("Borrar datos de usuario");
            setUserData({
                email: "",
                nombre: "",
                apellido: "",
                alias: "",
                createdAt: "",
                esp: "",
                url_img: ""
            });
            localStorage.removeItem("userData");
            navigate("/auth/login");
        }
    };

    const cookie = async () => {
        const res = await agorappApi.get("/usuario");
        console.log(res);
    }

    return (
        <div className="bg-none">
            <p>Inicio</p>
            <button onClick={handleLogout} className="text-xl">Logout</button>
             <button onClick={cookie} className="text-xl">Cookie</button>
        </div>
    )
}