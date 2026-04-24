import { useEffect, useRef, useState } from "react"
import PostResume, { type PostResumeProps } from "./PostResume";

type PostWrapperProps = { 
    postResumeData:PostResumeProps
};

export default function PostWrapper({ postResumeData } : PostWrapperProps ){
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(()=>{
        const observador = new IntersectionObserver((entry) => {
            if( entry[0].isIntersecting ){
                console.log("Mirando");
                setIsVisible(true);
            }
            else{
                setIsVisible(false);
            }
        },{ rootMargin: "600px 0px" });
        if( ref.current ) observador.observe(ref.current);
        return () => observador.disconnect();
    },[]);
    
    return (
        <div
            ref={ref}
            className="w-full"
        >
            {
                isVisible ?
                    <div className="transition-opacity duration-500 ease-in opacity-100">
                        <PostResume postResumeData={postResumeData} />
                    </div>
                :
                    <div className="w-full opacity-0 h-[400px]" />
            }
        </div>
    )
};