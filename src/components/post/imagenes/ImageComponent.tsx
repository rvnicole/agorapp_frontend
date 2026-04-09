import type { ImgsRespuesta } from "../../../types";

type ImageProps = {
    img: ImgsRespuesta,
    altImg: string,
    className?: string,
    imageClassName?: string,
    index?: number,
    onClick?: () => {}
};

export default function ImageComponent({ img, altImg, className, index, onClick, imageClassName }: ImageProps){
    return (
        <div
            key={index}
            className="relative w-full h-full shrink-0 flex items-center justify-center cursor-pointer"
            onClick={() => onClick ? onClick() : null}
        >
            <div
                className={`${className} absolute inset-0 bg-cover bg-center blur`}
                style={{ backgroundImage: `url(${img.urlImg})` }}
            />

            <img
                src={img.urlImg}
                className={`relative max-h-full max-w-full object-contain z-10 ${imageClassName}`}
                alt={`img_${altImg}`}
            />
        </div>
    );
};