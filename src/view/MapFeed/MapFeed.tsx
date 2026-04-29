import { useQuery } from "@tanstack/react-query";
import Map from "../../components/Map";
import { getMapPosts } from "../../api/PostAPI";
import { useEffect, useRef, useState } from "react";
import type { BoundsMap, ResponseMapPostList } from "../../types";
import { useFeedStore } from "../../store/feedStore";
import { Radar } from "lucide-react";

const redondeaBounds = (bounds: BoundsMap) => {
    
    return {
        swLat: Math.round(bounds.swLat * 100) / 100,
        swLng: Math.round(bounds.swLng * 100) / 100,
        neLat: Math.round(bounds.neLat * 100) / 100,
        neLng: Math.round(bounds.neLng * 100) / 100,
    }
};

export function MapFeed(){
    const [visible, setVisible] = useState(false);
    const { coordenadas, bounds, setBounds } = useFeedStore();
    const coords = useRef({ lat: 0, lng: 0 });

    const { data, refetch } = useQuery<ResponseMapPostList[]>({
        queryKey: ["getMapPost", redondeaBounds(bounds)],
        queryFn: () => getMapPosts(bounds)
    });

    useEffect(() => {
        // Pequeño delay para que la transición sea visible al montar
        const show = setTimeout(() => setVisible(true), 500);
        const hide = setTimeout(() => setVisible(false), 3500);
        return () => {
            clearTimeout(show);
            clearTimeout(hide);
        };
    }, []);

    return (
        <main className="fixed left-0 top-14 right-0 bottom-0">
                <section className={`${visible ? "animate-in fade-in slide-in-from-top-2 fixed p-10 top-7 left-6 right-6 z-10": "hidden"}`}>
                    <div className="backdrop-blur-lg bg-card/30 rounded-xl p-1 flex items-center justify-center text-center">
                        <Radar className="size-5"/>
                        <p className="p-3 text-sm">Esto es lo que pasa cerca de ti</p>
                    </div>
                </section>
                <Map 
                    userPosition={coordenadas}
                    firstMapRenderPosition={coords.current}
                    postPosition={data ? data : []}
                    isViewMap={true}
                    onBoundsChange={(bounds: BoundsMap) => { 
                        setBounds(bounds);
                        refetch()
                    }}
                />
        </main>
    )
};