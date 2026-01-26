import { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import MessageErrors from "../MessageErrors";
import { Loader2 } from "lucide-react";
import type { LoginType } from "../../types";

type TokenFormProps = {
    email: LoginType["email"];
    onLogin: (data: LoginType) => void;
    type: "login" | "confirmAccount";
};

const titles = {
    login: {
        default: "Iniciar Sesión",
        loading: "Iniciando sesión..."
    },
    confirmAccount: {
        default: "Verificar",
        loading: "Vetificando..."
    }
}

export default function TokenForm({ email, onLogin, type }: TokenFormProps) {
    const {register, handleSubmit, formState: { errors }} = useForm<LoginType>({
        defaultValues: { email },
        mode: "onChange"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = ({ token }: LoginType) => {
        onLogin({ email, token });
        setIsSubmitting(true);
    }

    return (
        <form  onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="token">Token*</Label>
                <Input
                    id="token"
                    type="text"
                    placeholder="012345"                                    
                    className="h-11"
                    onInput={(e) => {
                        console.log(e.currentTarget.value)
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                    }}
                    {...register("token", {
                        required: "El token es obligatorio"
                    })}
                />
                {errors.token && <MessageErrors>{errors.token.message}</MessageErrors>}
            </div>

            <Button 
                type="submit" 
                className={`w-full h-11 flex items-center justify-center ${isSubmitting && "disabled:opacity-60 disabled:cursor-not-allowed transition-all"}`}
                disabled={isSubmitting}
                variant="default" 
                size="default"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        { titles[type].loading }
                    </>
                ) : (
                    <>{titles[type].default}</>
                )}
            </Button>
        </form>
    )
}