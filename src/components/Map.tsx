import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import MarkerClousterGroup from "react-leaflet-cluster";
import type { DragEndEvent, LeafletEventHandlerFnMap } from "leaflet";
import type { NewUbicacionType } from "../types";
import "../utils/fixLeafletIcons";

type MapProps = {
    className?: string,
    userPosition: NewUbicacionType,
    postPosition: NewUbicacionType[],
    onDragend?: ({lat, lng}: NewUbicacionType) => Promise<void>,
    isViewMap?: boolean
}

function Recenter( { userPosition } : { userPosition: NewUbicacionType }) {
    const map = useMap();
  
    useEffect(() => {
        map.setView([userPosition.lat, userPosition.lng], 15);
    }, [userPosition]);
  
    return null;
}

export default function Map({ className, userPosition, onDragend, isViewMap, postPosition }: MapProps) {

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
                center={[userPosition.lat, userPosition.lng]}
                zoom={15}
                style={{
                    height: `${isViewMap ? "85dvh": "350px"}`, 
                    width: "100%" 
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Recenter userPosition={userPosition} />

                <MarkerClousterGroup>
                    {
                        postPosition.map( (coords) => {
                            return (
                                <Marker 
                                    draggable={ Boolean(onDragend) }
                                    position={[coords.lat, coords.lng]}
                                    eventHandlers={eventHandlers}
                                >
                                    <Popup>
                                        ⚠️Incidente aqui
                                    </Popup>
                                </Marker>
                            )
                        })
                    }
                </MarkerClousterGroup>
            </MapContainer>
        </div>
    )
}