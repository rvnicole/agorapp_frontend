import { flushSync } from "react-dom";
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
            flushSync(() => setUserData({
                email: "",
                nombre: "",
                apellido: "",
                alias: "",
                createdAt: "",
                esp: "",
                url_img: ""
            }));
            localStorage.removeItem("userData");
            navigate("/auth/login");
        }
    };

    const cookie = async () => {
        const res = await agorappApi.get("/usuario");
        console.log(res);
    }

    const deleteUser = async () => {
        const res = await agorappApi.delete("/usuario");
        console.log(res);
    };

    return (
        <div className="bg-none">
            <p>Inicio</p>
            <div>
                <button onClick={handleLogout} className="text-xl">Logout</button>
            </div>
            <div>
                <button onClick={cookie} className="text-xl">Cookie</button>
            </div>
            <div>
                <button onClick={deleteUser} className="text-xl">Eliminar usuario</button>
            </div>
        </div>
    )
}