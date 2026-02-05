import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card";
import EmailForm from "../../components/auth/EmailForm";
import TokenForm from "../../components/auth/TokenForm";
import { Button } from "../../components/ui/Button";
import { Loader2 } from "lucide-react";
import type { LoginType, ProviderType } from "../../types";

export default function Login() {
    const [email, setEmail] = useState("");        
    const [sentToken, setSentToken] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<ProviderType>();

    // Login con cuenta de un proveedor (google/microsoft/apple)
    const handleOAuthLogin = (provider: ProviderType) => {
        console.log("Iniciando sesión con ", provider);
        setOauthLoading(provider);
    }

    // Enviar email con el token para login
    const sendEmail = (email: LoginType["email"]) => {
        console.log("Enviando token al email ", email);
    }

    // Login de usuario
    const login = ({email, token}: LoginType) => {
        console.log("Iniciando sesion...", {email, token});
    }

    return (
        <>
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
                    {/* Logo */}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">AgoraApp</h1>
                <p className="text-muted-foreground">Sistema de gestión de incidentes urbanos</p>
            </div>

            <Card className="border">
                <CardHeader className="space-y-1">
                   <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                   <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center w-full h-11 bg-white hover:bg-gray-100 text-gray-900 dark:text-white border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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

                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center w-full h-11 bg-white hover:bg-gray-100 text-gray-900 dark:text-white border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            onClick={() => handleOAuthLogin("microsoft")}
                            disabled={Boolean(oauthLoading)}
                        >
                            {oauthLoading === "microsoft" ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23">
                                <path fill="#f35325" d="M0 0h11v11H0z" />
                                <path fill="#81bc06" d="M12 0h11v11H12z" />
                                <path fill="#05a6f0" d="M0 12h11v11H0z" />
                                <path fill="#ffba08" d="M12 12h11v11H12z" />
                                </svg>
                            )}
                            Continuar con Microsoft
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center justify-center w-full h-11 bg-black hover:bg-gray-900 text-white hover:text-white border-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            onClick={() => handleOAuthLogin("apple")}
                            disabled={Boolean(oauthLoading)}
                        >
                            {oauthLoading === "apple" ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                            )}
                            Continuar con Apple   
                        </Button>
                    </div>
                        
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">O continúa con email</span>
                            </div>
                        </div>
                            
                        <div className="relative h-40">
                            <div
                                className={`
                                    absolute inset-0
                                    transition-opacity duration-300
                                    ${sentToken ? "opacity-0 pointer-events-none" : "opacity-100"}
                                `}
                            >
                                { !sentToken && 
                                    <EmailForm
                                        onEmailSubmitted={(email) => {
                                            setEmail(email);
                                            setSentToken(true);
                                            sendEmail(email);
                                        }}
                                    />
                                }
                            </div>

                            <div
                                className={`
                                    absolute inset-0
                                    transition-opacity duration-500 delay-100
                                    ${sentToken ? "opacity-100" : "opacity-0 pointer-events-none"}
                                `}
                            >
                                {   sentToken && 
                                    <TokenForm 
                                        email={email}
                                        onLogin={login}
                                        type="login"
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    { sentToken && (
                        <div 
                            onClick={() => {
                                setSentToken(false);
                                setEmail("")
                            }}
                            className="text-sm text-primary font-medium cursor-pointer hover:underline">
                            Iniciar con otra cuenta
                        </div>
                    )}

                    <div className="text-sm text-center text-muted-foreground">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/auth/register" className="text-primary font-medium hover:underline">
                            Regístrate aquí
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}