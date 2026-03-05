import { useRef, useState } from "react";
import { Mic } from "lucide-react";

export default function RecordDescription() {
    const [isRecording, setIsRecording] = useState<Boolean>(false);
    const [readyRecording, setReadyRecording] = useState<Boolean>(false);
    const [resultRecording, setResultRecording] = useState<string>("");

    const w:any = window;
    const SpeechRecognition = new w.webkitSpeechRecognition();
    const speech = useRef<any>(SpeechRecognition);
    speech.current.continuous = true;

    speech.current.onresult = (e: any) => {
        console.log(e.results);
        const resultados = e.results;

        for(const result in resultados) {
            console.log
            const transcript = resultados[result].transcript;
            setResultRecording(r => `${r} ${transcript}`);
        }
    };

    const startRecording = () => {
        console.log("Grabando...");
        setReadyRecording(false);
        setIsRecording(true);
        speech.current.start();
    }

    const stopRecording = () => {
        console.log("Termino");
        speech.current.stop();
        setIsRecording(false);
        setReadyRecording(true);
    }

    return (
        <> 
            <div className="relative flex flex-col justify-center items-center gap-7 select-none">
                <div className="text-center">
                    <p className="text-2xl text-foreground font-bold">¿Qué ocurrió?</p>
                    <p className="text-lg text-foreground font-semibold">Describe brevemente el incidente</p>
                </div>
                
                    { isRecording ?
                        <>
                            <div className="relative">
                                <button
                                    className="relative z-10 flex justify-center items-center bg-accent h-20 w-20 rounded-full cursor-pointer hover:scale-105"
                                    onClick={stopRecording}
                                >
                                    <Mic className="h-10 w-10 text-white" />
                                </button>
                
                                <span className="absolute inset-0 bg-accent h-20 w-20 rounded-full animate-ping opacity-50" />   
                            </div>             
                        
                            <p className="font-semibold text-accent animate-pulse">Escuchando...</p>
                        </>
                        :
                        <>
                            <button
                                className="relative z-10 flex justify-center items-center bg-primary h-20 w-20 rounded-full cursor-pointer hover:scale-105"
                                onClick={startRecording}
                            >
                                <Mic className="h-10 w-10 text-white" />
                            </button>

                            <p className="font-semibold text-primary">Da click para iniciar</p>
                        </>
                    }

                    {resultRecording}
            </div>            
        </>
    )
}