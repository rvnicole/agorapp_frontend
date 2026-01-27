import { useForm } from "react-hook-form";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import MessageErrors from "../ui/MessageErrors";
import type { LoginType } from "../../types";


type EmailType = Pick<LoginType, "email">;

type EmailFormProps = {
    onEmailSubmitted: (email: string) => void;
}

export default function EmailForm({ onEmailSubmitted }: EmailFormProps) {
    const {register, handleSubmit, formState: { errors }} = useForm<EmailType>({ mode: "onChange" });

    const onSubmit = ({ email }: EmailType) => {
        onEmailSubmitted(email);
    }

    return (
        <form  onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico*</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"                                    
                    className="h-11"
                    {...register("email", {
                        required: "El email es obligatorio",
                        validate: (value) =>
                        /\S+@\S+\.\S+/.test(value) || "Ingresa un email válido"
                    })}
                />
                {errors.email && <MessageErrors>{errors.email.message}</MessageErrors>}
            </div>

            <Button 
                type="submit" 
                className="w-full h-11" 
                variant="default" 
                size="default"
            >
                Continuar
            </Button>
        </form>
    )
}