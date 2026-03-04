import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card";
import EmailForm from "../../components/auth/EmailForm";
import TokenForm from "../../components/auth/TokenForm";
import { Button } from "../../components/ui/Button";
import { Loader2 } from "lucide-react";
import type { LoginType, ProviderType } from "../../types";
import { loginWithGoogle } from "../../api/authAPI";
import { useMessageStore } from "../../store/messageStore";

export default function Login() {
    const [email, setEmail] = useState("");        
    const [sentToken, setSentToken] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<ProviderType>();
    const { showMessages } = useMessageStore( state => state );

    // Login con cuenta de un proveedor (google/microsoft/apple)
    const handleOAuthLogin = async (provider: ProviderType) => {
        setOauthLoading(provider);
        try{
            if( provider === "google" ){
                const urlGoogleLogin = await loginWithGoogle();
                if(urlGoogleLogin) window.location.href = urlGoogleLogin;
            };
        }
        catch(error: any){
            setOauthLoading(undefined);
            if("messages" in error && Array.isArray(error.messages)) {
                error.messages.forEach((error: string) => showMessages("error", error)); 
            };
        };
    };

    // Enviar email con el token para login
    const sendEmail = (email: LoginType["email"]) => {
        console.log("Enviando token al email ", email);
    }

    // Login de usuario
    const login = ({email, token}: LoginType) => {
        console.log("Iniciando sesion...", {email, token});
    }

    if( localStorage.getItem("userData") ) return <Navigate to="/" />
    return (
        <>

            <Card className="border md:h-auto">
                <CardHeader className="space-y-1">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
                            {/* Logo */}
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight"><h1>AgoraApp</h1></CardTitle>
                        <p className="text-muted-foreground">Sistema de gestión de incidentes urbanos</p>
                    </div>
                   <CardDescription className="text-center">
                        <div className="bg-secondary p-2 rounded text-muted-foreground">
                            Únete a miles de ciudadanos mejorando su entorno <br />
                            <span className="text-primary font-bold text-sm">Rápido, Seguro, Gratis.</span>
                        </div>
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center w-full h-11 bg-white hover:bg-gray-100 text-gray-900 dark:text-white border-gray-300"
                            onClick={() => handleOAuthLogin("google")}
                            disabled={Boolean(oauthLoading)}
                        >
                            {oauthLoading === "google" ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            )}
                            Continuar con Google
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">

                    <div className="text-sm text-center text-muted-foreground">
                        Inicia sesión con Google para empezar a reportar.
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}