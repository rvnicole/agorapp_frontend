import { useState } from "react";
import { useRecording } from "../../hooks/useRecording";
import { useMutation } from "@tanstack/react-query";
import VoiceRecorder from "./VoiceRecorder";
import DescriptionEditor from "./DescriptionEditor";
import { getRefinedDescription } from "../../api/PostAPI";

type RecordDescriptionProps = {
    next: (descripcion: string) => void;
}

export default function RecordDescription({ next }: RecordDescriptionProps) {
    const [preferText, setPreferText] = useState(false);
    
    const { mutate } = useMutation({
        mutationFn: getRefinedDescription,
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (error) => {
            if("messages" in error && Array.isArray(error.messages)) {
                error.messages.forEach((error: string) => {
                    console.log(error);
                    //showMessages("error", error);
                }); 
            }
        }
    });
    
    const {
        transcript, 
        isSupported, 
        isRecording, 
        readyRecording, 
        startRecording, 
        stopRecording, 
        changeResult, 
        resetRecording
    } = useRecording();

    if( !isSupported || readyRecording || preferText ) {
        return (
            <DescriptionEditor
                transcript={transcript}
                preferText={preferText}
                isSupported={isSupported}
                onChange={changeResult}
                onNext={(descripcion) => mutate(descripcion)}
                onRetry={() => {
                    setPreferText(false);
                    resetRecording();
                }}
            />
        )
    }
    return (
        <VoiceRecorder 
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            onPreferText={() => setPreferText(true)}
        />
    )
}