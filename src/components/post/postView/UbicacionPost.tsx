import { useQuery } from "@tanstack/react-query";
import { Card } from "../../ui/Card";
import Map from "../../Map";
import type { PostRespuesta } from "../../../types"
import { getAddress } from "../../../api/AddressAPI";
import { MapPin } from "lucide-react";

type UbicacionPostProps = {
    post: PostRespuesta;
}

export default function UbicacionPost({ post }: UbicacionPostProps) {

    const { data } = useQuery({
        queryKey: ["get-address", post.id],
        queryFn: async () => {
            if( post.lat != null && post.lon != null) {
                return getAddress({ lat: post.lat, lng: post.lon });
            }            
        }
    });
    
    return (
        <Card className="border p-5 w-3xl">
            <div className="relative">
                { post.lat != null && post.lon != null && (
                    <Map position={{ lat: post.lat, lng: post.lon }} />
                )}

                <div className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row justify-between gap-3 p-3 bg-white/30 backdrop-blur">
                    <div>
                        { data && <p className="text-sm font-semibold text-zinc-800">{data}</p> }
                        <div className="flex gap-2">
                            <p className="text-xs font-semibold text-zinc-700">{ post.lat?.toFixed(6) },</p>
                            <p className="text-xs font-semibold text-zinc-700">{ post.lon?.toFixed(6) }</p>
                        </div>
                    </div>
                    
                    <a
                        href={`https://www.google.com/maps?q=${post.lat},${post.lon}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <MapPin className="h-4 w-4" />
                        Abrir en Google Maps
                    </a>
                </div>
            </div>
        </Card>
    )
}