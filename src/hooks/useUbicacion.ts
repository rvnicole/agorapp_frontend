import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../store/messageStore";
import { getAddress } from "../api/AddressAPI";
import type { ApiErrorType, NewUbicacionType } from "../types";

type UseUbicacionProps = {
    onChange?: (coords: NewUbicacionType) => void;
}

export default function useUbicacion({ onChange }: UseUbicacionProps) {
    const [mode, setMode] = useState(false); // true -> ubicación en tiempo real // false -> Manual
    const [position, setPosition] = useState<NewUbicacionType>({ lat: 19.4326, lng: -99.1332 });
    const [address, setAddress] = useState("");
    const [loadingUbicacion, setloadingUbicacion] = useState(false);

    const { showMessages } = useMessageStore(state => state); 

    const { mutate, isPending } = useMutation({
        mutationFn: getAddress,
        onSuccess: (data) => {
            //console.log("Dirección: ", data);
            setAddress(data);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => {
                showMessages("error", error);
            });          
        }
    });

    const applyPosition = ({ lat, lng }: NewUbicacionType) => {
        if( onChange ) onChange({ lat, lng });

        // Coordenadas
        setPosition({ lat, lng });

        // Dirección
        mutate({ lat, lng });

        setloadingUbicacion(false);
    }

    const getPosition = () => {
        setloadingUbicacion(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                setMode(true);

                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                applyPosition({lat, lng});
            },
            (error) => {
                setMode(false);
                setloadingUbicacion(false);
                console.error(error);
                showMessages("error", "No se pudo obtener la ubicación.");
            }
        );
    }

    const getManualPosition = async ({lat, lng}: NewUbicacionType) => {
        setPosition({ lat, lng });
        applyPosition({lat, lng});
    }

    return ({
        mode,
        setMode,
        position,
        address,
        loadingAddress: isPending,
        loadingUbicacion,
        getPosition,
        getManualPosition
    })
}