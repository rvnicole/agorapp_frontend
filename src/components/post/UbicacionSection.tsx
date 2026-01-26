import useUbicacion from "../../hooks/useUbicacion";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Toggle } from "../ui/Toggle";
import AddressSearchInput from "./AddressSearchInput";
import Map from "../Map";
import { Loader2 } from "lucide-react";
import type { NewUbicacionType } from "../../types";

type UbicacionSectionProps = {
    onChange: ({ lat, lng }: NewUbicacionType) => void;
}

export default function UbicacionSection({ onChange }: UbicacionSectionProps) {
    // Gestiona la Ubicación
    const { mode, setMode, position, address, loadingUbicacion, getPosition, getManualPosition } = useUbicacion({ onChange });
    
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <Label className="text-base font-semibold">Ubicación*</Label>

                    <div className="flex items-center justify-between gap-2">
                        { loadingUbicacion ? (
                            <>
                                <p className="text-muted-foreground text-sm font-medium">Localizando...</p>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            <>
                                <p className={`text-sm font-medium ${ mode ? "text-primary" : "text-muted-foreground"}`}>Usar ubicación actual</p>
                                <Toggle
                                    enabled={mode}
                                    setModeTrue={() => getPosition() }
                                    setModeFalse={() => setMode(false) }
                                />
                            </>
                        )}
                    </div>
                </div>
                
                { mode ? (
                    <Input value={ address } disabled />
                ) : (
                    <AddressSearchInput value={ address } onChange={ getManualPosition } /> 
                )}
            </div>

            <Map
                position={position}
                onDragend={getManualPosition}
            />
        </div>
    )
}