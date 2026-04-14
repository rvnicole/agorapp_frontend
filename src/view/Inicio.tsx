import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { agorappApi } from "../lib/agorappApi";
import { useUserStore } from "../store/userStore";
import { deleteToken } from "firebase/messaging";
import { messaging } from "../api/firebase";
import { useEffect, useRef, useState } from "react";
import PostWrapper from "../components/post/postFeed/PostWrapper";
import { MapPinned, Megaphone } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/PostAPI";

export default function Inicio() {
    const ref = useRef(null);
    const [shouldFetch, setShouldFetch] = useState(false);

    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["getUserPosts"],
        queryFn: ({ pageParam }) => getPosts(pageParam),
        initialPageParam: new Date().toISOString(),
        getNextPageParam: (lastPage) => {
            if( !lastPage?.length ) return undefined;
            return lastPage[lastPage.length - 1].created_at;
        },
        enabled: shouldFetch
    });

    useEffect(() => {
        const observador = new IntersectionObserver((elementos) => {
            if(elementos[0].isIntersecting){
                if( !data ) {
                    setShouldFetch(true);
                    return;
                }
                fetchNextPage();
            };
        });
        if(ref.current) observador.observe(ref.current);

        return () => observador.disconnect();
    },[isPending, isFetchingNextPage]);
    
    if(true) return (
        <main className="h-[80dvh] flex flex-col justify-center items-center"> 
            <p className="text-center p-10">
                No hay publicaciones cercanas. 
                Puedes comenzar a publicar para encontrar 
                reportes cerca de tu ubicación.
            </p>
            <MapPinned 
                className="size-20"
                strokeWidth={0.5}
            />
        </main> );
    if(true) return (
        <main>
            <div className="md:w-3xl w-full space-y-4 flex flex-col justify-center items-center">
                <div className="w-full flex justify-items-start space-x-2 px-2 pb-3">
                    <Megaphone className="size-6 text-base"/>
                    <p className="text-muted-foreground font-semibold">ÚLTIMOS REPORTES</p>
                </div>
                
                {
                    data?.pages && data.pages.flat().map( userPost => { 
                        if( userPost ) return <PostWrapper key={userPost.id} postResumeData={userPost}/>
                    })
                }
                
                <div ref={ref}>
                    {
                        (isPending || hasNextPage) && <div className="my-10"><Spinner /></div>
                    }
                </div>
            </div>
        </main>
    );

    /*
    const { setUserData } =  useUserStore();
    
    useEffect(()=> {
        
    }, []);

    // ESTO ES UNA PRUEBA PARA CONTROLAR EL CIERRE DE SESION 
    const navigate = useNavigate();
    const handleLogout = async () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("fb_token");
        const res = await deleteToken(messaging);
        console.log("token push eliminado", res);
        try{
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
        }
        catch(error){
            console.log(error);
        };
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
        </div>
    )*/
}