import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FullScreen from "../ui/FullScreen";
import { Mic } from "lucide-react";

export default function RecordDescription() {
    const [isRecording, setIsRecording] = useState<Boolean>(false);
    const navigate = useNavigate();

    return (
        <FullScreen
            open={true}
            onClose={() => navigate("/")}
        > 
            <div className="relative flex flex-col justify-center items-center gap-7">
                <div className="text-center">
                    <p className="text-2xl text-foreground font-bold">¿Qué ocurrió?</p>
                    <p className="text-lg text-foreground font-semibold">Describe brevemente el incidente</p>
                </div>                

                <div className="relative flex flex-col justify-center items-center gap-7">
                    { isRecording ?
                        <>
                            <button
                                className="relative z-10 flex justify-center items-center bg-accent h-20 w-20 rounded-full cursor-pointer hover:scale-105"
                                onClick={() => setIsRecording(false)}
                            >
                                <Mic className="h-10 w-10 text-white" />
                            </button>
            
                            <span className="absolute inset-0 bg-accent h-20 w-20 rounded-full animate-ping opacity-50" />                
                        
                            <p>j</p>
                        </>
                        :
                        <>
                            <button
                                className="relative z-10 flex justify-center items-center bg-primary h-20 w-20 rounded-full cursor-pointer hover:scale-105"
                                onClick={() => setIsRecording(true)}
                            >
                                <Mic className="h-10 w-10 text-white" />
                            </button>

                            <p className="font-semibold text-primary">Da click para iniciar</p>
                        </>
                    }
                </div>
            </div>            
        </FullScreen>
    )
}