import { useState } from "react";
import FullScreen from "../../ui/FullScreen";
import { ChevronLeft, ChevronRight, CircleSmall } from "lucide-react";
import type { ImgsRespuesta } from "../../../types"

type CarruselImgs = {
    imgs: ImgsRespuesta[]
}

export default function CarruselImgs({ imgs }: CarruselImgs) {
    const [startX, setStartX] = useState<number | null>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [current, setCurrent] = useState(0);
    const url = imgs[current].urlImg;

    const prev = () => setCurrent(c => (c === 0 ? imgs.length - 1 : c - 1));

    const next = () => setCurrent(c => (c === imgs.length - 1 ? 0 : c + 1));

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;
    
        const endX = e.changedTouches[0].clientX;
        const diferencia = startX - endX;
    
        if (diferencia > 50) {
            next();
        } 
        else if (diferencia < -50) {
            prev();
        }
    
        setStartX(null);
    };

    return (
        <div 
            className="relative w-full h-96 overflow-hidden md:rounded-xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {imgs.map((img, index) => (
                    <img
                        key={index}
                        src={img.urlImg}
                        className="w-full h-full object-cover shrink-0"
                        onClick={() => setFullScreen(true)}
                    />
                ))}
            </div>

            <CarruselControls 
                total={imgs.length}
                current={current}
                onPrev={prev}
                onNext={next}
                onSelect={setCurrent}
            />

            <FullScreen
                open={fullScreen}
                onClose={() => setFullScreen(false)}
            >
                <p className="absolute z-20 top-3 left-1/2 -translate-x-1/2 font-semibold bg-background/50 px-3 rounded-full">
                    {current + 1} / {imgs.length}
                </p>
                
                <img
                    id="full-screen-img"
                    src={url}
                    alt="imagen"
                    className="relative z-10 h-full"
                />

                <CarruselControls 
                    total={imgs.length}
                    current={current}
                    onPrev={prev}
                    onNext={next}
                    onSelect={setCurrent}
                />
            </FullScreen>
        </div>
    )
}

type CarruselControlsProps = {
    total: number;
    current: number;
    onPrev: () => void;
    onNext: () => void;
    onSelect: (index: number) => void;
}

function CarruselControls({total, current, onPrev, onNext, onSelect}: CarruselControlsProps) {
    const isTouchDevice = 'ontouchstart' in window;

    return (
        <>
            <button
                className="absolute z-20 left-3 top-1/2 -translate-y-1/2 h-10 w-10 text-background bg-foreground/40 hover:bg-foreground/70 rounded-full cursor-pointer"
                hidden={isTouchDevice}
                onClick={onPrev}
            >
                <ChevronLeft className="h-6 w-6 m-auto mr-2.5"/>
            </button>

            <button
                className="absolute z-20 right-3 top-1/2 -translate-y-1/2 h-10 w-10 text-background bg-foreground/40 hover:bg-foreground/70 rounded-full cursor-pointer"
                hidden={isTouchDevice}
                onClick={onNext}
            >
                <ChevronRight className="h-6 w-6 m-auto ml-2.5"/>
            </button>

            <div
                className="absolute z-20 bottom-3 left-1/2 -translate-x-1/2 flex gap-1"
            >
                { Array.from({ length: total }).map((_, index) => (
                    <CircleSmall 
                        key={index} 
                        className={`h-5 w-5 ${current === index ? "text-white" : "text-white/40"} fill-current cursor-pointer`}
                        onClick={() => onSelect(index)}
                    />
                ))}
            </div>
        </>
    )
}