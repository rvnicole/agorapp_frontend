import { X } from "lucide-react";
import { Card } from "./Card";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
    if (!open) return null;
    
    return (
        <div 
            data-slot="modal"
            className="fixed h-full inset-0 flex items-center justify-center z-100"
        >
        
            <div
                className="absolute inset-0 bg-background/5 backdrop-blur"
                onClick={onClose}
            />

            <Card className="relative max-h-[90%] border p-6 w-full max-w-md shadow-xl mx-2 fade-in">
                
                {children}
    
                <button
                    className="absolute top-3 right-3 text-foreground hover:text-foreground/50"
                    onClick={onClose}
                >
                    <X className="h-4 w-4 cursor-pointer"/>
                </button>
            </Card>
        </div>
    )
}