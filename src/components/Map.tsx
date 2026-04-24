import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import MarkerClousterGroup from "react-leaflet-cluster";
import { divIcon } from "leaflet";
import type { DragEndEvent, LeafletEventHandlerFnMap } from "leaflet";
import type { BoundsMap, NewUbicacionType, ResponseMapPostList } from "../types";
import "../utils/fixLeafletIcons";
import { Link } from "react-router-dom";
import BadgeCategoria from "./post/postView/BadgeCategoria";

const crearIcono = () => divIcon({
    html: `
        <div style="
            position: relative;
            width: 20px;
            height: 20px;
        ">
            <!-- Pulso -->
            <div style="
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: rgba(59, 130, 246, 0.4);
                animation: pulso 1.5s ease-out infinite;
            "></div>
            <!-- Punto central -->
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #3b82f6;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
        </div>
        <style>
            @keyframes pulso {
                0%   { transform: scale(1);   opacity: 0.8; }
                100% { transform: scale(2.5); opacity: 0;   }
            }
        </style>
    `,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

type MapProps = {
    className?: string,
    userPosition: NewUbicacionType,
    firstMapRenderPosition?: NewUbicacionType,
    postPosition: NewUbicacionType[] | ResponseMapPostList[],
    onDragend?: ({lat, lng}: NewUbicacionType) => Promise<void>,
    isViewMap?: boolean,
    onBoundsChange?: (bounds: BoundsMap) => void
};

function Recenter( { userPosition } : { userPosition: NewUbicacionType }) {
    const map = useMap();
  
    useEffect(() => {
        map.setView([userPosition.lat, userPosition.lng], 17);
    }, [userPosition]);
  
    return null;
};

function BoundsListener({ onBoundsChange }: { onBoundsChange: MapProps["onBoundsChange"] }){
    const map = useMap();

    useEffect(() => {
        const handleMoveEnd = () => {
            const bounds = map.getBounds();
            if( onBoundsChange ) onBoundsChange({
                neLat: bounds.getNorthEast().lat,
                neLng: bounds.getNorthEast().lng,
                swLat: bounds.getSouthWest().lat,
                swLng: bounds.getSouthWest().lng
            });
        };

        map.on("moveend", handleMoveEnd);
        return () => { 
            map.off("moveend", handleMoveEnd)
        };
    }, [map]);

    return null;
};

export default function Map({ className, userPosition, firstMapRenderPosition, onDragend, isViewMap, postPosition, onBoundsChange }: MapProps) {
    const [showInfo, setShowInfo] = useState(false);
    const [marcadorSeleccionado, setMarcdorSeleccionado] = useState<ResponseMapPostList>({
        id: 0,
        descripcion: "",
        categoria: 0,
        direccion: "",
        lat: 0,
        lng: 0,
        titulo: "",
        tipo: "",
        created_at: ""
    });

    const eventHandlers = useMemo<LeafletEventHandlerFnMap>(() => ({
        dragend: async (e: DragEndEvent) => {
            const { lat, lng } = e.target.getLatLng();
            if(onDragend) {
                onDragend({ lat, lng });
            }
        }
    }), [onDragend]);
    
    return (
        <div className={`rounded-lg overflow-hidden relative z-0 ${className}`}>
            <MapContainer
                center={isViewMap ? [firstMapRenderPosition!.lat, firstMapRenderPosition!.lng] : [userPosition.lat, userPosition.lng]}
                zoom={15}
                style={{
                    height: `${isViewMap ? "85dvh": "350px"}`, 
                    width: "100%" 
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <Recenter userPosition={userPosition} />
                <BoundsListener onBoundsChange={onBoundsChange}/>

                {
                    isViewMap && 
                    <Marker
                        position={[userPosition.lat,userPosition.lng]}
                        icon={crearIcono()}
                    />
                }

                <MarkerClousterGroup>
                    {
                        postPosition.length > 0 && postPosition.map( (coords) => {
                            return (
                                <Marker 
                                    key={"id" in coords ? coords.id : coords.lat}
                                    draggable={ Boolean(onDragend) }
                                    position={[coords.lat, coords.lng]}
                                    eventHandlers={{
                                        ...eventHandlers,
                                        click: () => {
                                            setShowInfo(true);
                                            if("descripcion" in coords) setMarcdorSeleccionado(coords);
                                        }
                                    }}
                                >
                                </Marker>
                            )
                        })
                    }
                </MarkerClousterGroup>
            </MapContainer>
            {
                    showInfo && isViewMap &&
                        <div className="fixed bottom-24 left-1 right-1 md:left-1/2 md:-translate-x-1/2 z-700 md:w-full max-w-sm
                            bg-popover backdrop-blur-lg text-popover-foreground 
                            rounded-2xl border shadow-md p-3 
                            animate-in fade-in slide-in-from-bottom-4 duration-300"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <BadgeCategoria 
                                    categoria={marcadorSeleccionado.categoria} 
                                    className="text-xs"
                                />
                                <button 
                                    onClick={() => setShowInfo(false)}
                                    className="text-muted-foreground hover:text-foreground cursor-pointer px-2"
                                >
                                    ✕
                                </button>
                            </div>

                            <h3 className="font-semibold text-sm mb-1">
                                {marcadorSeleccionado.titulo}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                {marcadorSeleccionado.direccion}
                            </p>

                            <div className="w-full flex justify-center">
                                <Link className="w-full text-center text-md bg-primary text-primary-foreground rounded-lg py-2 hover:opacity-90 transition-opacity"
                                    to={`/post/${marcadorSeleccionado.tipo}/${marcadorSeleccionado.id}?createdAt=${marcadorSeleccionado.created_at}`}
                                >
                                    Ver publicación
                                </Link>
                            </div>
                        </div>
                }
        </div>
    )
}