type ToggleProps = {
    enabled: boolean,
    setModeTrue: () => void,
    setModeFalse: () => void
}

export function Toggle({enabled, setModeTrue, setModeFalse}: ToggleProps) { 
    
    return (
        <div 
            data-slot="toggle"
            className="relative w-[82px] h-6 bg-primary/20 rounded-full flex items-center"
        >
            <div
                className={`absolute h-5 rounded-full shadow transition-transform
                    ${enabled ? "translate-x-0.5 w-10 bg-primary" : "translate-x-10 w-10 bg-primary/30"}
                `}
            />
            
            <div className="flex justify-between w-full px-3 relative z-10 text-sm text-white">
                <div
                    className={`w-full cursor-pointer ${enabled ? "font-semibold" : "text-muted-foreground"}`}
                    onClick={setModeTrue}
                >
                    <span className="text-transparent select-none">True</span>
                </div>
                <div
                    className={`w-full cursor-pointer ${!enabled ? "font-semibold" : "text-muted-foreground"}`}
                    onClick={setModeFalse}
                >
                    <span className="text-transparent select-none">False</span>
                </div>
            </div>
        </div>
    )
}