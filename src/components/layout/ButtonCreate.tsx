import { Plus } from "lucide-react"

type ButtonCreate = {
    className?: string;
    text?: string;
    onClick: () => void;
}

export default function ButtonCreate({ onClick, text, className }: ButtonCreate) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`fixed bottom-8 right-8 z-50 group bg-primary text-primary-foreground p-3 rounded-full cursor-pointer hover:scale-105 ${className}`}
        >
            { text && (
                <span
                    className="absolute right-full mr-3 min-w-32 py-1 px-3 bg-primary text-primary-foreground text-sm rounded-full pointer-events-none opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                >
                    {text}
                </span>
            )}

            <Plus className="h-7 w-7"/>
        </button>
    )
}