import { useState } from "react";
import { useRecording } from "../../../hooks/useRecording";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../../store/messageStore";
import VoiceRecorder from "./VoiceRecorder";
import DescriptionEditor from "./DescriptionEditor";
import DescriptionComparison from "./DescriptionComparison";
import { getRefinedDescription } from "../../../api/PostAPI";
import type { ApiErrorType, DescriptionRespuesta } from "../../../types";

type RecordDescriptionProps = {
    next: (data: DescriptionRespuesta) => void;
}

export default function RecordDescription({ next }: RecordDescriptionProps) {
    const [refinedDescription, setRefinedDescription] = useState<DescriptionRespuesta | null>();
    const [preferText, setPreferText] = useState(false);
    const { showMessages } = useMessageStore(state => state);
    
    const { mutate, isPending } = useMutation({
        mutationFn: getRefinedDescription,
        onSuccess: (data) => {
            setRefinedDescription(data)
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
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

    if( refinedDescription && !isPending ) {
        return (
            <DescriptionComparison
                original={transcript}
                improved={refinedDescription.descripcion}
                onSelect={(descripcion) => next({...refinedDescription, descripcion})}
                onRetry={() => {
                    setPreferText(false);
                    resetRecording();
                    setRefinedDescription(null);
                }}
            />
        )
    }
    if( !isSupported || readyRecording || preferText ) {
        return (
            <DescriptionEditor
                description={transcript}
                preferText={preferText}
                isSupported={isSupported}
                isLoading={isPending}
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