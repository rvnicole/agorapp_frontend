import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CircleSmall } from "lucide-react";
import type { ImgsRespuesta } from "../../types"
import FullScreen from "../ui/FullScreen";

type CarruselImgs = {
    imgs: ImgsRespuesta[]
}

export default function CarruselImgs({ imgs }: CarruselImgs) {
    const [current, setCurrent] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);
    const url = useMemo(() => imgs[current].urlImg,[current]);

    const prev = () => {
        setCurrent(c => (c === 0 ? imgs.length - 1 : c - 1));
    }

    const next = () => {
        setCurrent(c => (c === imgs.length - 1 ? 0 : c + 1));
    }

    return (
        <div 
            className="relative w-full h-60 rounded-xl overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
        >
            <div className="absolute w-full h-full bg-primary/10 backdrop-blur"/>

            <img
                id="carrusel-img"
                src={url}
                alt="imagen"
                className="relative z-10 cursor-pointer object-cover h-full m-auto"
                onClick={() => setFullScreen(true)}
            />

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
    return (
        <>
            <button
                className="absolute z-20 left-3 top-1/2 -translate-y-1/2 h-10 w-10 text-white bg-primary/60 hover:bg-primary/70 rounded-full cursor-pointer"
                onClick={onPrev}
            >
                <ChevronLeft className="h-6 w-6 m-auto"/>
            </button>

            <button
                className="absolute z-20 right-3 top-1/2 -translate-y-1/2 h-10 w-10 text-white bg-primary/60 hover:bg-primary/70 rounded-full cursor-pointer"
                onClick={onNext}
            >
                <ChevronRight className="h-6 w-6 m-auto"/>
            </button>

            <div
                className="absolute z-20 bottom-3 left-1/2 -translate-x-1/2 flex gap-1"
            >
                { Array.from({ length: total }).map((_, index) => (
                    <CircleSmall 
                        key={index} 
                        className={`h-5 w-5 ${current === index ? "text-white" : "text-white/30"} fill-current cursor-pointer`}
                        onClick={() => onSelect(index)}
                    />
                ))}
            </div>
        </>
    )
}