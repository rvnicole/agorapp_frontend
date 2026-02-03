import { Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Textarea } from "../../ui/Textarea";
import { Select, SelectItem } from "../../ui/Select";
import { categorias } from "../../../data/categorias";
import MessageErrors from "../../ui/MessageErrors";
import type { Post } from "../../../types";

type InformationSectionProps = {
    tipo: Post["tipo"];
    register: UseFormRegister<Post>;
    control: Control<Post>;
    errors: FieldErrors<Post>;
}

export default function InformationSection({ tipo, register, control, errors }: InformationSectionProps) {
    
    return (
        <section className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="titulo" className="text-base font-semibold">Título*</Label>
                <Input
                    id="titulo"
                    placeholder="Ej: Bache grande en la calle"
                    {...register("titulo", {
                        required: "El titulo es obligatorio"
                    })}
                />
                { errors.titulo && <MessageErrors>{errors.titulo.message}</MessageErrors> }
            </div>

            <div className="space-y-2">
                <Label id="categoriaId" className="text-base font-semibold">Categoria*</Label>
                <Controller
                    name="categoriaId"
                    control={control}
                    rules={{ 
                        required: "La categoría es obligatoria" 
                    }}
                    render={({ field }) => (
                        <Select
                            aria-labelledby="categoriaId"
                            value={field.value?.toString() ?? ""}
                            onChange={field.onChange}
                            placeholder="Selecciona una categoria"
                        >
                            { categorias.map(item => (
                                <SelectItem 
                                    key={`${item.id}`}
                                    value={`${item.id}`}
                                    text={item.categoria}
                                />
                            ))}                    
                        </Select>
                    )}
                />
                { errors.categoriaId && <MessageErrors>{errors.categoriaId.message}</MessageErrors> }
            </div>

            <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-base font-semibold">Descripción*</Label>
                <Textarea
                    id="descripcion"
                    placeholder="Describe el incidente con el mayor detalle posible..."
                    {...register("descripcion", {
                        required: "La descripcion es obligatoria"
                    })}
                />
                { errors.descripcion && <MessageErrors>{errors.descripcion.message}</MessageErrors> }
            </div>

            { tipo !== "reporte" && (
                <div className="space-y-2">
                    <Label htmlFor="link" className="text-base font-semibold">Link</Label>
                    <Input
                        id="link"
                        placeholder="Ej: https://example.com"
                        {...register("link", {
                            pattern: {
                                value: /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                                message: "El enlace no es válido"
                            }
                        })}
                    />
                </div>
            )}
        </section>
    )
}