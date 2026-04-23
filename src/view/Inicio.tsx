import { useCallback } from "react";
import PostWrapper from "../components/post/postFeed/PostWrapper";
import { MapPinned, NavigationOff, Radar } from "lucide-react";
import { useInfiniteQuery} from "@tanstack/react-query";
import { getPosts } from "../api/PostAPI";
import Spinner from "../components/ui/Spinner";
import { useFeedStore } from "../store/feedStore";
import type { PostRespuesta, RequestListPost } from "../types";

export default function Inicio() {
    const { coordenadas } = useFeedStore();

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

    if( coordenadas.lat === 0) return <>
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
            <div className="flex items-center p-3 justify-start w-full">
                <Radar className="size-7"/>
                <p className="p-3 w-full">Esto es lo que pasa cerca de ti</p>
            </div>
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