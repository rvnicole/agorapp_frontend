import { useQuery } from "@tanstack/react-query";
import Map from "../../components/Map";
import { useFeedStore } from "../../store/feedStore";
import { getMapPosts } from "../../api/PostAPI";
import { useEffect, useRef, useState } from "react";
import { useUbicacion } from "../../hooks/useUbicacion";
import type { BoundsMap, ResponseMapPostList } from "../../types";

const redondeaBounds = (bounds: BoundsMap) => {
    
    return {
        swLat: Math.round(bounds.swLat * 100) / 100,
        swLng: Math.round(bounds.swLng * 100) / 100,
        neLat: Math.round(bounds.neLat * 100) / 100,
        neLng: Math.round(bounds.neLng * 100) / 100,
    }
}

export function MapFeed(){
    const [bounds, setBounds] = useState({ neLat: 0, neLng: 0, swLat: 0, swLng: 0 });
    const { coordenadas, setCoordenadas } = useFeedStore();
    const coords = useRef(coordenadas);
    const [shouldFetch, setShouldFetch] = useState(false);
    const { getPosition } = useUbicacion({});

    const { data, refetch } = useQuery<ResponseMapPostList[]>({
        queryKey: ["getMapPost", redondeaBounds(bounds)],
        queryFn: () => getMapPosts(bounds),
        enabled: shouldFetch
    });

    useEffect(() => {
        if(coords.current.lat === 0) {
            const getCoordenadas = async () => {
                    coords.current = await getPosition();
            };
            getCoordenadas();
        };
        console.log({bounds, coordenadas, shouldFetch});
    },[]);

    return (
        <main className=" overflow-hidden">
                <Map 
                    userPosition={coords.current}
                    postPosition={data ? data : []}
                    isViewMap={true}
                    onBoundsChange={(bounds: BoundsMap) => { 
                        setBounds(bounds); 
                        if(!shouldFetch) {
                            setShouldFetch(true)
                        }
                        else{
                            refetch()
                        }
                    }}
                />
        </main>
    )
};