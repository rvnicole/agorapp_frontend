import { useEffect, useRef, useState } from "react";

export function useRecording() {
    const [transcript, setTranscript] = useState<string>("");
    const [isSupported, setIsSupported] = useState<boolean>(true);
    const [isRecording, setIsRecording] = useState<boolean>(false);   
    const [readyRecording, setReadyRecording] = useState<boolean>(false);
    const speech = useRef<any | null>(null);

    useEffect(() => {
        if(typeof window === "undefined") {
            setIsSupported(false);
            return;
        }

        const w:any = window;
        const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        speech.current = new SpeechRecognition();
        speech.current.continuous = true;
        speech.current.lang = "es-MX";

        speech.current.onresult = (e: any) => {
            const resultados = e.results;
            let texto = "";
    
            for(let i = 0; i < resultados.length; i++) {
                const transcript = resultados[i][0].transcript;
                texto = `${texto} ${transcript}`;
            }

            setTranscript(texto);
        };

        speech.current.onstop = (e: any) => {
            speech.current.onend = () => {
                if (isRecording) {
                    speech.current.start();
                }
            };
        };

        speech.current.onerror = (e: any) => {
            console.log("Error SpeechRecognition", e.error);
            setIsSupported(false);
        };

        return () => {
            speech.current.stop();
        }
    }, []);

    const startRecording = () => {
        setReadyRecording(false);
        speech.current.start();
        setIsRecording(true);
    }

    const stopRecording = () => {
        speech.current.stop();
        setIsRecording(false);
        setReadyRecording(true);
    }

    const changeResult = (valor: string) => {
        setTranscript(valor);
    }

    const resetRecording = () => {
        setTranscript("");
        setReadyRecording(false);
        speech.current.stop();
    }

    return {
        transcript,
        isSupported,
        isRecording,        
        readyRecording,
        startRecording,
        stopRecording,
        changeResult,
        resetRecording
    }
}