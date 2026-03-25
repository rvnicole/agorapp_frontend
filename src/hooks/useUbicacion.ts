import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../store/messageStore";
import { getAddress } from "../api/AddressAPI";
import type { ApiErrorType, NewUbicacionType } from "../types";

type UseUbicacionProps = {
    onChange?: (coords: NewUbicacionType) => void;
};

export function useUbicacion({ onChange }: UseUbicacionProps) {
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
            error.messages.forEach((error: string) => showMessages("error", error));        
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

    const getCurrentPosition = (): Promise<NewUbicacionType> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
    
                    resolve({ lat, lng });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    };

    const getPosition = async () => {
        setloadingUbicacion(true);

        try {
            const coords = await getCurrentPosition();

            setMode(true);
            applyPosition(coords);
        }
        catch(error) {
            setMode(false);
            console.error(error);
            showMessages("error", "No se pudo obtener la ubicación.");
        }
        finally {
            setloadingUbicacion(false);
        }
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
        getCurrentPosition,
        getPosition,
        getManualPosition
    })
}