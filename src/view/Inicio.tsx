import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { agorappApi } from "../lib/agorappApi";
import { useUserStore } from "../store/userStore";
import { deleteToken } from "firebase/messaging";
import { messaging } from "../api/firebase";
import { useEffect } from "react";
import Comment from "../components/post/Comment";
import { Card } from "../components/ui/Card";

export default function Inicio() {
    const { setUserData } =  useUserStore();
    

    useEffect(()=> {
        
    }, []);

    // ESTO ES UNA PRUEBA PARA CONTROLAR EL CIERRE DE SESION 
    const navigate = useNavigate();
    const handleLogout = async () => {
        localStorage.removeItem("userData");
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

    const cookie = async () => {
        if("vibrate" in navigator ) {
            navigator.vibrate(200);
        };
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
            <div>
                <button onClick={() => navigate("/profile")} className="text-xl">Profile</button>
            </div>

            <Card className="border p-5">
                <Comment
                    postId={1}
                    createdAt="a" 
                    comment={{
                        id:1,
                        comentario:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                        alias:"Nico",
                        created_at:(new Date()).toString()
                    }}
                    onReply={c => console.log("Comment", c)}
                />
            </Card>
            
        </div>
    )
}