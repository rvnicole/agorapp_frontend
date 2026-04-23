import { useQuery } from "@tanstack/react-query";
import Map from "../../components/Map";
import { getMapPosts } from "../../api/PostAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUbicacion } from "../../hooks/useUbicacion";
import type { BoundsMap, ResponseMapPostList } from "../../types";
import { useFeedStore } from "../../store/feedStore";
import { calcularDistanciaMetros } from "../../utils/calcularDistancia";

const redondeaBounds = (bounds: BoundsMap) => {
    
    return {
        swLat: Math.round(bounds.swLat * 100) / 100,
        swLng: Math.round(bounds.swLng * 100) / 100,
        neLat: Math.round(bounds.neLat * 100) / 100,
        neLng: Math.round(bounds.neLng * 100) / 100,
    }
};

const DISTANCIA_MINIMA_METROS = 0.1;

export function MapFeed(){
    const { getPosition } = useUbicacion({});
    const { coordenadas, setCoordenadas, bounds, setBounds } = useFeedStore();
    const coords = useRef({ lat: 0, lng: 0 });
    //alert(coords.current.lat);
    const [shouldFetch, setShouldFetch] = useState(false);

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
        console.log({bounds, shouldFetch});
    },[]);

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
            () => {},
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
        if( distanciaCalculada + 0.3 >= DISTANCIA_MINIMA_METROS ){
            setCoordenadas({ lat, lng });
            coords.current = { lat, lng };
        };
    },[]);

    return (
        <main className="">
                <Map 
                    userPosition={coordenadas}
                    firstMapRenderPosition={coords.current}
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