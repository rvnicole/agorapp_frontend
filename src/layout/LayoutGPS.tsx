import { Outlet } from "react-router-dom";
import { useUbicacion } from "../hooks/useUbicacion";
import { useFeedStore } from "../store/feedStore";
import { useMessageStore } from "../store/messageStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { calcularDistanciaMetros } from "../utils/calcularDistancia";
import Permissions from "../components/permissons/Permissions";

const DISTANCIA_MINIMA_METROS = 70;

export function LayoutGPS(){
    
    const { getPosition } = useUbicacion({});
    const { coordenadas, setCoordenadas } = useFeedStore();
    const { showMessages } = useMessageStore();
    const coords = useRef({ lat: 0, lng: 0 });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if(!ready) return;
        if(coords.current.lat === 0) {
            const getCoordenadas = async () => {
                    coords.current = await getPosition();
                    setCoordenadas(coords.current);
                    //setShouldFetch(true);
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

    return <Outlet />
};