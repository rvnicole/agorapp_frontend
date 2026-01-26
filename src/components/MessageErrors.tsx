import { AlertCircle } from "lucide-react";

type MessageErrorsProps = {
    children: React.ReactNode;
}

export default function MessageErrors ({ children }: MessageErrorsProps) {
    return (
        <div className="bg-destructive flex items-center justify-center gap-2 px-2 py-3 rounded">
            <AlertCircle className="h-4 w-4 text-destructive-foreground" />
            <p className="text-center text-destructive-foreground text-sm leading-none font-medium select-none">{children}</p>
        </div>
    )
}