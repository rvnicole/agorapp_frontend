import Map from "../../components/Map";
import { useFeedStore } from "../../store/feedStore";
import type { NewUbicacionType } from "../../types";

export function MapFeed(){
    const { coordenadas, publicaciones } = useFeedStore();
    const post: NewUbicacionType[] = publicaciones.map( pub => ({ lat: pub.lat!, lng: pub.lon! }) );

    if(post.length && post[0].lat && post[0].lng) return (
        <main>
                <Map 
                    userPosition={coordenadas}
                    postPosition={post}
                    isViewMap={true}
                />
        </main>
    )
}