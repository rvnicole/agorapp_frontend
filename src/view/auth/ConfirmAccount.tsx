import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import TokenForm from "../../components/auth/TokenForm";
import type { LoginType } from "../../types";

export default function ConfirmAccount() {
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    useEffect(() => {
        if(!email) {
            navigate("/auth/login");
        }
    }, [email]);

    // Verificar cuenta de usuario
    const verifyAccount = (data: LoginType) => {
        console.log("Verificando...", data);
        navigate("/");
    }

    return (
        <>
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
                    {/* Logo */}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">AgoraApp</h1>
            </div>

            <Card className="border">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Confirmar cuenta</CardTitle>
                    <CardDescription>
                        Revisa tu correo
                        <span className="font-bold">{" "}{email}{" "}</span> 
                        e ingresa el código de verificación para activar tu cuenta.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <TokenForm 
                        email={email!}
                        onLogin={verifyAccount}
                        type="confirmAccount"
                    />
                </CardContent>
            </Card>
        </>
    )
}