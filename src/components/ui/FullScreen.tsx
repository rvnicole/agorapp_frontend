import { useEffect } from "react";
import { X } from "lucide-react";

type FullScreenProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function FullScreen({ open, onClose, children }: FullScreenProps) {
    if (!open) return null;

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        }
      
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);      

    return (
        <div
            data-slot="fullscreen"
            className="fixed h-full inset-0 flex items-center justify-center z-100"
        >
            <div
                className="absolute inset-0 bg-background/50 backdrop-blur"
                onClick={onClose}
            />

            <div>
                {children}
    
                <button
                    className="absolute top-3 right-3 text-foreground hover:text-foreground/50"
                    onClick={() => {
                        document.body.style.overflow = "";
                        onClose();
                    }}
                >
                    <X className="h-6 w-6 cursor-pointer"/>
                </button>
            </div>
        </div>
    )
}