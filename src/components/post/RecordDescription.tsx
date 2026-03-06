import { useRecording } from "../../hooks/useRecording";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { ArrowLeft, ArrowRight, Keyboard, Mic } from "lucide-react";

export default function RecordDescription() {
    const {transcript, isSupported, isRecording, readyRecording, startRecording, stopRecording, changeResult, resetRecording} = useRecording();

    if( !isSupported || readyRecording ) {
        return (
            <div className="relative flex flex-col justify-center items-center gap-7 select-none animate-traslate">
                <div className="text-center px-5">
                    <p className="text-2xl text-foreground font-bold">{isSupported ? "Descripción del incidente":"¿Qué ocurrió?"}</p>
                    <p className="text-lg text-foreground font-semibold">{isSupported ? "Puedes modificarla si algo no se interpretó correctamente":"Describe brevemente el incidente"}</p>
                    {!isSupported && <p className="text-muted-foreground text-sm font-semibold">La función de descripción por voz no está disponible en este navegador, te recomendamos usar Chrome.</p>}
                </div>

                <div className="px-5 w-screen md:w-xl lg:w-2xl">
                    <Textarea
                        className="w-full min-h-[10vh] h-[20vh] max-h-[40vh]"
                        value={transcript}
                        onChange={e => changeResult(e.target.value)}
                    />
                </div>

                <div className="fixed bottom-4 px-5 flex gap-2 flex-col w-full md:flex-row md:w-md">
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex items-center justify-center gap-1 w-full"
                        onClick={resetRecording}
                    >
                        <ArrowLeft className="h-5 w-5"/>
                        Volver a grabar
                    </Button>

                    <Button
                        type="button"
                        className="flex items-center justify-center gap-1 w-full"
                    >
                        Siguiente
                        <ArrowRight className="h-5 w-5"/>
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <div className="relative flex flex-col justify-center items-center gap-7 select-none animate-traslate">
            <div className="text-center">
                <p className="text-2xl text-foreground font-bold">¿Qué ocurrió?</p>
                <p className="text-lg text-foreground font-semibold">Describe brevemente el incidente</p>
            </div>
                    
            { isRecording ?
                <>
                    <div className="relative">
                        <button
                            className="relative z-10 flex justify-center items-center bg-destructive h-20 w-20 rounded-full cursor-pointer hover:scale-105"
                            onClick={stopRecording}
                        >
                            <Mic className="h-10 w-10 text-white" />
                        </button>
                    
                        <span className="absolute inset-0 bg-destructive h-20 w-20 rounded-full animate-ping opacity-50" />   
                    </div>             
                            
                    <p className="font-semibold text-destructive animate-pulse">Da click para detener</p>
                </>
                :
                <>
                    <button
                        className="relative z-10 flex justify-center items-center bg-primary h-20 w-20 rounded-full cursor-pointer hover:scale-105"
                        onClick={startRecording}
                    >
                        <Mic className="h-10 w-10 text-primary-foreground" />
                    </button>

                    <p className="font-semibold text-primary">Da click para iniciar</p>

                    <div className="px-5 flex justify-center items-center w-full md:flex-row md:w-xs">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex items-center justify-center gap-2 w-full"
                            onClick={resetRecording}
                        >
                            <Keyboard className="h-5 w-5"/>
                            Prefiero escribir 
                        </Button>
                    </div>
                </>
            }
        </div>
    )
}