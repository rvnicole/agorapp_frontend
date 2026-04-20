import { useCallback, useEffect, useRef, useState } from "react";
import PostWrapper from "../components/post/postFeed/PostWrapper";
import { MapPinned, NavigationOff } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/PostAPI";
import { useUbicacion } from "../hooks/useUbicacion";
import Spinner from "../components/ui/Spinner";
import Permissions from "../components/permissons/Permissions";

export default function Inicio() {
    const [shouldFetch, setShouldFetch] = useState(false);
    const [ready, setReady] = useState(false);
    const { getPosition, position } = useUbicacion({});

    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["getPosts"],
        queryFn: ({ pageParam }) => getPosts(pageParam),
        initialPageParam: position.lat ? {...position, lastId: 0, lastPostDate: ""} : {},
        getNextPageParam: (lastPage) => {
            console.log("ultima pagina", lastPage);
            if( !lastPage?.length ) return undefined;
                const ultimoRes = lastPage[lastPage.length - 1];
                console.log(ultimoRes);
                return {
                    lat: ultimoRes.lat, 
                    lng: ultimoRes.lon,  
                    lastId: ultimoRes.id, 
                    lastPostDate: ultimoRes.created_at
                }
        },
        enabled: shouldFetch,
        gcTime: 10 * 60 * 1000
    });

    const refFeed = useCallback((node: HTMLDivElement | null) => {
        if(!node) return;

        const observador = new IntersectionObserver((elementos) => {
            if(elementos[0].isIntersecting && !isFetchingNextPage){
                if(!data) {
                    setShouldFetch(true);
                    return;
                }
                fetchNextPage();
            }
        });

        observador.observe(node);
    }, [isFetchingNextPage, data]);

    useEffect(() => {
        console.log({ ready });
        if(ready) {
            const getCoordenadas = async () => {
                await getPosition();
                setShouldFetch(true);
            };
            getCoordenadas();
        }
    },[ready]);
    
    if(!ready && position.lat === 0) return <>
            <main className="h-[80dvh] flex flex-col justify-center items-center">
                <Permissions onGranted={() => setReady(true)}/>
                <p className="text-xs">Solicitando ubicación GPS...</p>
            </main>
        </>
    if(ready && position.lat === 0) return <>
            <main className="h-[80dvh] flex flex-col justify-center items-center">
                <p className="text-center p-10">
                    No fue posible obtener tu ubicación, muevete un poquito e intentalo de nuevo
                </p>
                <NavigationOff 
                    className="size-20"
                    strokeWidth={1}
                />
            </main>
        </>
    if( !isPending &&  data?.pages.flat().length === 0 ) return (
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
    if(  position.lat !== 0 ) return (
        <main className="flex flex-col justify-center items-center">
            <div className="md:w-3xl w-full space-y-4 flex flex-col justify-center items-center">
                {
                    data?.pages && data.pages.flat().map( userPost => { 
                        if( userPost ) return <PostWrapper key={"feed_" + userPost.id} postResumeData={userPost}/>
                    })
                }
                
                <div>
                    {
                        (isPending || hasNextPage) && 
                        <>
                            <div ref={refFeed} className="mt-10">
                                <Spinner />
                            </div>
                        </>
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