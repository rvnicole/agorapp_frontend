import { useQuery } from "@tanstack/react-query";
import Map from "../../components/Map";
import { getMapPosts } from "../../api/PostAPI";
import { useRef, useState } from "react";
import type { BoundsMap, ResponseMapPostList } from "../../types";
import { useFeedStore } from "../../store/feedStore";

const redondeaBounds = (bounds: BoundsMap) => {
    
    return {
        swLat: Math.round(bounds.swLat * 100) / 100,
        swLng: Math.round(bounds.swLng * 100) / 100,
        neLat: Math.round(bounds.neLat * 100) / 100,
        neLng: Math.round(bounds.neLng * 100) / 100,
    }
};

export function MapFeed(){
    const { coordenadas, bounds, setBounds } = useFeedStore();
    const coords = useRef({ lat: 0, lng: 0 });

    const { data, refetch } = useQuery<ResponseMapPostList[]>({
        queryKey: ["getMapPost", redondeaBounds(bounds)],
        queryFn: () => getMapPosts(bounds)
    });

    return (
        <main className="">
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