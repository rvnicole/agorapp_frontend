import { useQuery } from "@tanstack/react-query";
import { Card } from "../../ui/Card";
import TitleSection from "../../ui/TitleSection";
import Map from "../../Map";
import { getAddress } from "../../../api/AddressAPI";
import { MapPin, MapPinned } from "lucide-react";
import type { NewUbicacionType } from "../../../types";

type UbicacionPostProps = {
    position: NewUbicacionType;
}

export default function UbicacionPost({ position }: UbicacionPostProps) {

    const { data } = useQuery({
        queryKey: ["get-address", position],
        queryFn: async () => getAddress(position)
    });
    
    return (
        <div id="ubicacion-post" className="w-full space-y-3">
            <TitleSection
                icon={<MapPinned className="h-5 w-5" />}
                title="Ubicación del Incidente"
            />

            <Card className="border p-5 w-full">
                <div className="relative">
                    <Map className="rounded-none md:rounded-lg" position={position} />

                    <div className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row justify-between gap-3 p-3 bg-white/30 backdrop-blur rounded-none md:rounded-b-lg">
                        <div>
                            { data && <p className="text-sm font-semibold text-zinc-800">{data}</p> }
                            <div className="flex gap-2">
                                <p className="text-xs font-semibold text-zinc-700">{ position.lat.toFixed(6) },</p>
                                <p className="text-xs font-semibold text-zinc-700">{ position.lng.toFixed(6) }</p>
                            </div>
                        </div>
                        
                        <a
                            href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
                            target="_blank"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                            <MapPin className="h-4 w-4" />
                            Abrir en Google Maps
                        </a>
                    </div>
                </div>
            </Card>
        </div>
    )
}