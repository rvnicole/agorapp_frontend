import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useAppStore } from "../../store/appStore";
import { Button } from "../ui/Button";
import { Loader2 } from "lucide-react";
import ImageSection from "./ImageSection";
import InformationSection from "./InformationSection";
import UbicacionSection from "./UbicacionSection";
import MessageErrors from "../ui/MessageErrors";
import type { Post } from "../../types";

type PostFormProps = {
    post?: Post;
    tipo: Post["tipo"];
    onSubmit: (post: Post) => void;
}

export default function PostForm({ post, tipo, onSubmit }: PostFormProps){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { usuarioId } = useAppStore(state => state);

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<Post>({
        mode: "onChange",
        defaultValues: {
            ...post,
            tipo,
            usuarioId
        }
    });

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
            <ImageSection onChange={(imgs) => {
                setValue("imgs", imgs);
            }}/>
            { errors.imgs && <MessageErrors>{errors.imgs.message}</MessageErrors> }

            <InformationSection
                tipo={ tipo }
                register={ register }
                control={ control }
                errors={ errors}
            /> 
            
            <UbicacionSection onChange={({ lat, lng }) => {
                console.log("Coords", {lat, lng});
                setValue("lat", lat);
                setValue("lng", lng);
            }}/>
            { (errors.lat || errors.lng ) && <MessageErrors>La ubicación es obligatoria</MessageErrors> }

            <div className="space-y-3 pt-4">
                <Button 
                    type="submit" 
                    className="w-full h-12 flex items-center justify-center text-base" 
                    disabled={isSubmitting}
                    variant="default" 
                    size="default"
                >
                    { isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>{post ? "Editar Reporte" : "Crear Reporte"}</>
                    )}
                </Button>
            </div>
        </form>
    )
}