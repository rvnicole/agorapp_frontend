import { useRef } from "react";

type SwipeLeftProps = {
    children: React.ReactNode;
    action?: () => void;
}

export default function SwipeLeft({ children, action }: SwipeLeftProps) {
    const ref = useRef<HTMLDivElement>(null);

    const startX = useRef(0);
    const currentX = useRef(0);
    const isSwiping = useRef(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        isSwiping.current = true;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping.current || !ref.current) return;

        const x = e.touches[0].clientX;
        const diff = x - startX.current;

        if (diff < 0) {
            const clamped = Math.max(diff, -200);
            currentX.current = clamped;

            ref.current.style.transform = `translate3d(${clamped}px,0,0)`;
        }
    };

    const handleTouchEnd = () => {
        if (!ref.current) return;

        isSwiping.current = false;
        const limite = -80;

        ref.current.style.transition = "transform 0.2s ease";

        if (currentX.current < limite) {
            ref.current.style.transform = "translate3d(-100%,0,0)";
            if(action) action();
        } 
        else {
            ref.current.style.transform = "translate3d(0,0,0)";
        }

        setTimeout(() => {
            if (ref.current) {
                ref.current.style.transition = "none";
            }
        }, 200);
    };
    
    return (
        <div
            ref={ref}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                touchAction: "pan-y",
                transform: "translate3d(0,0,0)"
            }}
        >
            {children}
        </div>
    )
}