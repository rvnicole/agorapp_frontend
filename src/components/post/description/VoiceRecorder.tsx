import { Keyboard, Mic } from "lucide-react";
import { Button } from "../../ui/Button";

type VoiceRecorderProps = {
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => void;
    onPreferText: () => void;
}

export default function VoiceRecorder({ isRecording, startRecording, stopRecording, onPreferText }: VoiceRecorderProps) {
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
                            onClick={onPreferText}
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