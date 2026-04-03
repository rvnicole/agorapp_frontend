import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Card } from "../../ui/Card";
import { Select, SelectItem } from "../../ui/Select";
import { estadosDetails } from "../../../data/estados";
import { Textarea } from "../../ui/Textarea";
import { Button } from "../../ui/Button";
import MessageErrors from "../../ui/MessageErrors";
import TitleSection from "../../ui/TitleSection";
import { createEstado } from "../../../api/EstadoAPI";
import { Loader2, Send, Settings } from "lucide-react";
import type { ApiErrorType, NewEstado, Post } from "../../../types";
import { useMessageStore } from "../../../store/messageStore";

type CreateEstadoProps = {
    postId: Post["id"];
    postCreatedAt: Post["createdAt"];
}

export default function CreateEstado({ postId, postCreatedAt }: CreateEstadoProps) {
    const { register, handleSubmit, control, formState: { errors }} = useForm<NewEstado>({ mode: "onChange" });
    const { showMessages } = useMessageStore( state => state );

    const { mutate, isPending } = useMutation({
        mutationFn: createEstado,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    const handleOnSubmit = ({ estado, descripcion }: NewEstado) => {      
        mutate({ estado, descripcion, postId, postCreatedAt });
    } 

    return (
        <div id="create-estado-admin" className="w-full space-y-3">
            <TitleSection
                icon={<Settings className="h-5 w-5" />}
                title="Acciones de Administrador"
            />

            <Card className="border p-5 w-full">
                <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col items-end gap-3">
                    <div className="w-full space-y-2">
                        <Controller
                            name="estado"
                            control={control}
                            rules={{ required: "Debes elegir un estado" }}
                            render={({ field }) => (
                                <Select
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    placeholder="Selecciona una estado"
                                >
                                    { Object.entries(estadosDetails).map(estadoDetail => {
                                        const [estado, { titulo }] = estadoDetail;
                                        return (<SelectItem key={estado} value={estado} text={titulo} />)
                                    }) }
                                </Select>
                            )}
                        />
                        { errors.estado && <MessageErrors>{errors.estado.message}</MessageErrors> }
                    </div>

                    <div className="w-full space-y-2">
                        <Textarea 
                            id="descripcion"
                            placeholder="Agrega una nota sobre los cambios realizados..." 
                            {...register("descripcion", { required: "Es necesaria una descripción" })}
                        />
                        { errors.descripcion && <MessageErrors>{errors.descripcion.message}</MessageErrors> }
                    </div>

                    <Button 
                        type="submit" 
                        className="flex items-center justify-center gap-1 text-base w-full md:w-fit" 
                        disabled={isPending}
                    >
                        { isPending ? (
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
                </form>
            </Card>
        </div>
    )
}