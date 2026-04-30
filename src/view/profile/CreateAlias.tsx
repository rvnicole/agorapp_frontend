import { useState, type ChangeEvent, useEffect } from "react";
import { useMessageStore } from "../../store/messageStore";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { registerAlias } from "../../api/userAPI";
import Spinner from "../../components/ui/Spinner"
import { CircleCheck, Loader2, Send } from "lucide-react";
import type { ApiErrorType } from "../../types";

export default function CreateAlias() {
    const { user, consulted, setUserData } = useUserStore();
    const { showMessages } = useMessageStore( state => state );
    const[ newAlias, setNewAlias ] = useState<string>("");
    const[ validaciones, setValidaciones ] = useState({
        letra: false,
        caracteres: false,
        longitud: false,
    });
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: registerAlias,
        onSuccess: (data) => {
            console.log("Alias creado", data);
            if( !data.success ) return;

            localStorage.setItem("userData", {...user, ...data.data});
            setUserData({...user, ...data.data})         
            showMessages("success", `Bienvenid@ ${newAlias}`);
            navigate("/"); 
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => showMessages("error", error)); 
        }
    });

    useEffect(() => {
        console.log(consulted, user.alias);

        if( consulted && user.alias?.length ) {
            navigate("/");  
        }       
    }, [user.alias, consulted]);

    useEffect(() => {
        setValidaciones({
            letra: /(?=.*[a-zA-Z])/.test(newAlias),
            caracteres: /[a-zA-Z0-9_-]/.test(newAlias),
            longitud: newAlias.length >= 5,
        });
    }, [newAlias]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setNewAlias(a => {
            if( a.length > 30 ) return a;
            if (!/^[a-zA-Z0-9_-]*$/.test(value)) return a;
            return value;
        });
    }
    
    if( !consulted ) return <Spinner />
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-2">
                    {/* Logo */}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">AgorApp</h1>
            </div>

            <Card className="border w-full max-w-md md:h-auto animate-traslate">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Alias</CardTitle>
                    <CardDescription>Para continuar, crea un alias. No mostraremos tus datos personales: solo este nombre y tu foto de perfil serán visibles</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="flex gap-1 flex-col md:flex-row">
                        <Input
                            value={newAlias}
                            placeholder="User-123"
                            onChange={handleChange}
                        />

                        <Button
                            type="button"
                            className="flex items-center justify-center gap-1 text-base w-full md:w-fit"
                            disabled={isPending}
                            onClick={() => mutate({
                                nombre: user.nombre, 
                                apellido: user.apellido, 
                                alias: newAlias
                            })}
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
                    </div>
                    

                    <div className="space-y-1">
                        <div className="flex gap-1 items-center">
                            <CircleCheck className={validaciones.letra ? "fill-primary text-primary-foreground h-4 w-4" : "text-muted-foreground h-3.5 w-3.5"}/>
                            <p className={`text-xs ${validaciones.letra ? "text-primary" : "text-muted-foreground"}`}>Al menos 1 letra</p>
                        </div>

                        <div className="flex gap-1 items-center">
                            <CircleCheck className={validaciones.caracteres ? "fill-primary text-primary-foreground h-4 w-4" : "text-muted-foreground h-3.5 w-3.5"}/>
                            <p className={`text-xs ${validaciones.caracteres ? "text-primary" : "text-muted-foreground"}`}>Unicamente caracteres a-z, 0-9, - y _</p>
                        </div>

                        <div className="flex gap-1 items-center">
                            <CircleCheck className={validaciones.longitud ? "fill-primary text-primary-foreground h-4 w-4" : "text-muted-foreground h-3.5 w-3.5"}/>
                            <p className={`text-xs ${validaciones.longitud ? "text-primary" : "text-muted-foreground"}`}>Mínimo 5 caracteres</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}