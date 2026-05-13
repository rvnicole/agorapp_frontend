import { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import { Textarea } from "../../ui/Textarea";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type DescriptionEditorProps = {
    description: string;
    preferText: boolean;
    isSupported: boolean;
    isLoading: boolean;
    onChange: (descripcion: string) => void;
    onNext: (descripcion: string) => void;
    onRetry: () => void;
}

const buttonDescriptions = ["Cargando...", "Espera un momento...", "Categorizando...", "Llamando modelo IA..."];

export default function DescriptionEditor({ description, preferText, isSupported, isLoading, onChange, onNext, onRetry }: DescriptionEditorProps) {   
    const [buttonDescription, setButtonDescription] = useState("");
    
    useEffect(() => {
        let i = 0;
        if(isLoading){
            const timer = setTimeout(() => {
                if( i > buttonDescriptions.length - 1 ){
                    setButtonDescription(buttonDescriptions[i]);
                    i++;
                }
                else{
                    i = 0;
                }
            }, 3000);
        }
    }, [isLoading]);
    
    return (
        <div className="relative w-screen p-10 flex flex-col justify-center items-center gap-7 select-none animate-traslate">
            <div className="text-center">
                <p className="text-2xl text-foreground font-bold">{!isSupported || preferText ? "¿Qué ocurrió?" : "Descripción del incidente"}</p>
                <p className="text-lg text-foreground font-semibold">{!isSupported || preferText ? "Describe brevemente el incidente" : "Puedes modificarla si algo no se interpretó correctamente"}</p>
                {!isSupported && <p className="text-muted-foreground text-sm font-semibold">La función de descripción por voz no está disponible por el momento.</p>}
            </div>

            <div className="w-full md:w-xl lg:w-2xl">
                <Textarea
                    className="w-full min-h-[10vh] h-[20vh] max-h-[40vh]"
                    value={description}
                    onChange={e => onChange(e.target.value)}
                />
            </div>

            <div className="flex gap-2 flex-col w-full md:flex-row md:w-md">
                { isSupported &&
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={ () => onRetry() }
                    >
                        <ArrowLeft className="h-5 w-5"/>
                        Volver a grabar
                    </Button>
                }

                <Button
                    type="button"
                    className="flex items-center justify-center gap-1 w-full"
                    disabled={description.length <= 0}
                    onClick={() => onNext(description)}
                >
                    { isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {buttonDescription}
                        </>
                    ) : (
                        <>
                            Continuar
                            <ArrowRight className="h-5 w-5"/>
                        </>                        
                    )}
                </Button>
            </div>
        </div>
    )
}