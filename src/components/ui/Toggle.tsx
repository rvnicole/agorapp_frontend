import { useState } from "react";

type ToggleProps = {
    setModeTrue: () => void,
    setModeFalse: () => void,
    isOn: boolean,
    disable?: boolean
};

export function Toggle({setModeTrue, setModeFalse, isOn, disable}: ToggleProps) { 
    const [enabled, setEnable] = useState(isOn);
    
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
        <button 
            data-slot="toggle"
            className={`bg-primary/20 relative w-[50px] h-6 rounded-full flex items-center cursor-pointer`}
            onClick={switchToggle}
            disabled={disable}
        >
            <div
                className={`absolute h-5 rounded-full shadow transition-all duration-300 ease-in-out
                    ${enabled ? "translate-x-7 w-5 bg-primary" : "translate-x-0.5 w-5 bg-primary/30"}
                `}
            />
        </button>
    )
}