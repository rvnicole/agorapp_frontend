import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";

type DescriptionEditorProps = {
    description: string;
    preferText: boolean;
    isSupported: boolean;
    onChange: (descripcion: string) => void;
    onNext: (descripcion: string) => void;
    onRetry: () => void;
}

export default function DescriptionEditor({ description, preferText, isSupported, onChange, onNext, onRetry }: DescriptionEditorProps) {   
    return (
        <div className="relative flex flex-col justify-center items-center gap-7 select-none animate-traslate">
            <div className="text-center px-5">
                <p className="text-2xl text-foreground font-bold">{!isSupported || preferText ? "¿Qué ocurrió?" : "Descripción del incidente"}</p>
                <p className="text-lg text-foreground font-semibold">{!isSupported || preferText ? "Describe brevemente el incidente" : "Puedes modificarla si algo no se interpretó correctamente"}</p>
                {!isSupported && <p className="text-muted-foreground text-sm font-semibold">La función de descripción por voz no está disponible por el momento.</p>}
            </div>

            <div className="px-5 w-screen md:w-xl lg:w-2xl">
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
                    Siguiente
                    <ArrowRight className="h-5 w-5"/>
                </Button>
            </div>
        </div>
    )
}