import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { Button } from "../../ui/Button";
import InformationSection from "./InformationSection";
import MessageErrors from "../../ui/MessageErrors";
import ImageSection from "./ImageSection";
import Map from "../../Map";
import { Loader2, Send } from "lucide-react";
import type { ImagenData, NewReport, Post } from "../../../types";

type PostFormProps = {
    post?: NewReport;
    tipo: Post["tipo"];
    onSubmit: (post: Post) => void;
}

export default function PostForm({ post, tipo, onSubmit }: PostFormProps){
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<Post>({
        mode: "onChange",
        defaultValues: {
            ...post,
            tipo
        }
    });

    const imgs = watch("imgs");
    const lat = watch("lat") || 19.4326;
    const lng = watch("lng") || -99.1332;

    useEffect(() => {
        register("imgs", {
            validate: (value) =>
                value && value.length > 0 || "Debes subir al menos una imagen"
        });
      
        register("lat", {
            validate: (value) =>
                value != null || "La ubicación es obligatoria"
        });
      
        register("lng", {
            validate: (value) =>
                value != null || "La ubicación es obligatoria"
        });
    }, [register]);
      

    // Enviar formulario
    const handleOnSubmit = (post: Post) => {
        setIsSubmitting(true);
        onSubmit(post);
    }

    return (
        <form onSubmit={handleSubmit( handleOnSubmit )} className="space-y-6">
            <ImageSection
                imgs={imgs}
                position={{ lat, lng }}
                onChange={({ imagenes, positions } : ImagenData) => {
                    const lat = positions[0].lat;
                    const lng = positions[0].lng;

                    setValue("imgs", imagenes);
                    setValue("lat", lat);
                    setValue("lng", lng);
                }}
            />
            { errors.imgs && <MessageErrors>{errors.imgs.message}</MessageErrors> }

            <InformationSection
                tipo={ tipo }
                register={ register }
                control={ control }
                errors={ errors}
            /> 
            
            <Map position={{lat, lng}} />
            { (errors.lat || errors.lng ) && <MessageErrors>La ubicación es obligatoria</MessageErrors> }

            <div className="space-y-3 pt-4">
                <Button 
                    type="submit" 
                    className="w-full h-12 flex items-center justify-center gap-1 text-base" 
                    disabled={isSubmitting}
                >
                    { isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            Enviar
                            <Send className="h-4 w-4 mt-1" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}