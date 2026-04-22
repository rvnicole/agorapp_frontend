import { useCallback, useEffect, useRef, useState } from "react";
import PostWrapper from "../components/post/postFeed/PostWrapper";
import { MapPinned, NavigationOff } from "lucide-react";
import { useInfiniteQuery} from "@tanstack/react-query";
import { getPosts } from "../api/PostAPI";
import { useUbicacion } from "../hooks/useUbicacion";
import Spinner from "../components/ui/Spinner";
import Permissions from "../components/permissons/Permissions";
import { useFeedStore } from "../store/feedStore";
import type { PostRespuesta, RequestListPost } from "../types";
import { useMessageStore } from "../store/messageStore";
import { calcularDistanciaMetros } from "../utils/calcularDistancia";

const DISTANCIA_MINIMA_METROS = 30;

export default function Inicio() {
    const [shouldFetch, setShouldFetch] = useState(false);
    const [ready, setReady] = useState(false);
    const { getPosition } = useUbicacion({});
    const { coordenadas, setCoordenadas } = useFeedStore();
    const { showMessages } = useMessageStore();
    const coords = useRef({ lat: 0, lng: 0 });

    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<PostRespuesta[]>({
        queryKey: ["getPosts", coordenadas.lat, coordenadas.lng],
        queryFn: ({pageParam}) => getPosts(pageParam as RequestListPost),
        initialPageParam: {...coordenadas, lastId: 0, lastPostDate: ""},
        getNextPageParam: (lastPage) => {
            if( !lastPage?.length ) return undefined;
                const ultimoRes = lastPage[lastPage.length - 1];
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
                if(data) {
                    fetchNextPage();
                    return;
                };
            };
        });

        observador.observe(node);
    }, [isFetchingNextPage, data]);

    useEffect(() => {
        if(!ready) return;
        if(coords.current.lat === 0) {
            const getCoordenadas = async () => {
                    coords.current = await getPosition();
                    setCoordenadas(coords.current);
                    setShouldFetch(true);
            };
            getCoordenadas();
        };
    },[ready]);

    useEffect(() => {
        if(!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                handleActualizarUbicacion({
                    oldLat: coords.current.lat,
                    oldLng: coords.current.lng,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (error) => {
                showMessages("error", error.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 10000,
                timeout: 10000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const handleActualizarUbicacion = useCallback(({ oldLat, oldLng, lat, lng } : { oldLat: number, oldLng: number, lat: number, lng: number } ) => {
        
        if(oldLat === 0) return;
        
        const distanciaCalculada = calcularDistanciaMetros(oldLat, oldLng, lat, lng);
        if( distanciaCalculada >= DISTANCIA_MINIMA_METROS ){
            setCoordenadas({ lat, lng });
            coords.current = { lat, lng };
        };
    },[]);
    
    if(!ready && coordenadas.lat === 0) return <>
            <main className="h-[80dvh] flex flex-col justify-center items-center">
                <Permissions onGranted={() => setReady(true)}/>
                <p className="text-xs">Solicitando ubicación GPS...</p>
            </main>
        </>

    if(ready && coordenadas.lat === 0) return <>
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

    if(  coordenadas.lat !== 0 ) return (
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
};