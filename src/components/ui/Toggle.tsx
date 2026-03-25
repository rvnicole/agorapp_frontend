import { useState } from "react";

type ToggleProps = {
    setModeTrue: () => void,
    setModeFalse: () => void,
};

export function Toggle({setModeTrue, setModeFalse}: ToggleProps) { 
    const [enabled, setEnable] = useState(false);
    
    const switchToggle = () => {
        setEnable((state) => {
            if(!state){
                setModeTrue();
            }
            else{
                setModeFalse();
            };
            return !state;
        });
    };

    return (
        <div 
            data-slot="toggle"
            className="relative w-[50px] h-6 bg-primary/20 rounded-full flex items-center cursor-pointer"
            onClick={switchToggle}
        >
            <div
                className={`absolute h-5 rounded-full shadow transition-all duration-300 ease-in-out
                    ${enabled ? "translate-x-7 w-5 bg-primary" : "translate-x-0.5 w-5 bg-primary/30"}
                `}
            />
        </div>
    )
}