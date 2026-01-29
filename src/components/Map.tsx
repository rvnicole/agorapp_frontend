import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { DragEndEvent, LeafletEventHandlerFnMap } from "leaflet";
import type { NewUbicacionType } from "../types";
import "../utils/fixLeafletIcons";

type MapProps = {
    className?: string,
    position: NewUbicacionType
    onDragend?: ({lat, lng}: NewUbicacionType) => Promise<void>
}

function Recenter({ position }: MapProps) {
    const map = useMap();
  
    useEffect(() => {
        map.setView([position.lat, position.lng], 15);
    }, [position]);
  
    return null;
}

export default function Map({ className, position, onDragend }: MapProps) {

    const eventHandlers = useMemo<LeafletEventHandlerFnMap>(() => ({
        dragend: async (e: DragEndEvent) => {
            const { lat, lng } = e.target.getLatLng();
            if(onDragend) {
                onDragend({ lat, lng });
            }
        },
    }), [onDragend]);
    
    return (
        <div className={`rounded-lg overflow-hidden relative z-0 ${className}`}>
            <MapContainer
                center={[position.lat, position.lng]}
                zoom={15}
                style={{ height: "350px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Recenter position={position} />

                <Marker 
                    draggable={ Boolean(onDragend) }
                    position={[position.lat, position.lng]}
                    eventHandlers={eventHandlers}
                >
                    <Popup>
                        ⚠️Incidente aqui
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}