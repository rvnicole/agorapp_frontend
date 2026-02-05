import { useState } from "react";
import { useForm } from "react-hook-form";
import useUbicacion from "../../hooks/useUbicacion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Toggle } from "../../components/ui/Toggle";
import Map from "../../components/Map";
import Modal from "../../components/ui/Modal";
import MessageErrors from "../../components/ui/MessageErrors";
import { curpRegex } from "../../utils/regex";
import { Check, Loader2 } from "lucide-react"
import type { RegisterType } from "../../types";

export default function Register() {    
    const [openModal, setOpenModal] = useState(false); // Abrir o Cerrar Modal
    const [showMessage, setShowMessage] = useState<"available"|"notAvailable"|null>(null); // Mensaje de alias disponible/no disponible
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Gestiona el Formulario de nuevo usuario (Registro) 
    const{register, setValue, watch, handleSubmit, formState: { errors }} = useForm<RegisterType>({ mode: "onChange" });
    const alias = watch("alias");

    // Gestiona la Ubicación
    const { mode, setMode, position, address, getPosition, getManualPosition } = useUbicacion({
        onChange: ({ lat, lng }) => { // Actualiza la ubicación en el formulario cada que esta cambia
            setValue("lat", lat);
            setValue("lng", lng);
        },
    });

    // Registrar un nuevo usuario
    const registerUser = (data: RegisterType) => {
        setIsSubmitting(true);
        console.log("registrando usuario...", data);

        navigate(`/auth/confirm-account?email=${data.email}`);
    }

    // Verificar disponibilidad de alias de usuario
    const verifyAlias = () => {
        console.log("Alias...", alias);
        setShowMessage("available");
    }

    return (
        <>
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
                    {/* Logo */}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Cuenta</h1>
                <p className="text-muted-foreground">Únete a la comunidad de reportes ciudadanos</p>
            </div>

            <Card className="border">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Registro</CardTitle>
                    <CardDescription>Completa el formulario para crear tu cuenta</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre*</Label>
                            <Input
                                id="nombre"
                                type="text"
                                placeholder="Julia"
                                className="h-11"
                                {...register("nombre", {
                                    required: "El nombre es obligatorio"
                                })}
                            />
                            {errors.nombre && <MessageErrors>{errors.nombre.message}</MessageErrors>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apellido">Apellidos*</Label>
                            <Input
                                id="apellido"
                                type="text"
                                placeholder="Gomez"
                                className="h-11"
                                {...register("apellido", {
                                    required: "El apellido es obligatorio"
                                })}
                            />
                            {errors.apellido && <MessageErrors>{errors.apellido.message}</MessageErrors>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico*</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                className="h-11"
                                {...register("email", {
                                    required: "El email es obligatorio"
                                })}
                            />
                            {errors.email && <MessageErrors>{errors.email.message}</MessageErrors>}
                        </div>

                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="alias">Alias*</Label>
                                <CardDescription>Este será el nombre que se mostrará en tus publicaciones.</CardDescription>
                            </div>

                            <div className="flex items-center gap-2">
                                <Input
                                    id="alias"
                                    type="text"
                                    placeholder="July123"
                                    className="h-11"
                                    {...register("alias", {
                                        required: "El alias es obligatorio"
                                    })}
                                />

                                <Button
                                    type="button"
                                    className="flex items-center justify-center gap-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={verifyAlias}
                                    disabled={!alias || isSubmitting}
                                >
                                    Verificar
                                    <Check className="size-6" />
                                </Button>
                            </div>

                            { showMessage === "available" && <div className="text-xs text-primary font-semibold">Alias disponible</div> }
                            { showMessage === "notAvailable" && <div className="text-xs text-destructive font-semibold">Este alias ya no se encuentra disponible</div> }
                            { errors.alias && <MessageErrors>{errors.alias.message}</MessageErrors> }
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fecha_nacimiento">Fecha de nacimiento*</Label>
                            <Input
                                id="fecha_nacimiento"
                                type="date"
                                className="h-11"
                                {...register("fecha_nacimiento", {
                                    required: "La fecha de nacimiento es obligatorias"
                                })}
                            />
                            {errors.fecha_nacimiento && <MessageErrors>{errors.fecha_nacimiento.message}</MessageErrors>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefono">Telefono (opcional)</Label>
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="5510203040"
                                className="h-11"
                                {...register("telefono", {
                                    maxLength: {
                                        value: 10,
                                        message: "El numero de telefono no es valido"
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "El numero de telefono no es valido"
                                    },
                                })}
                            />
                            {errors.telefono && <MessageErrors>{errors.telefono.message}</MessageErrors>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="curp">CURP (opcional)</Label>
                            <Input
                                id="curp"
                                type="text"
                                placeholder="GOVF050721MDFLRN02"
                                className="h-11"
                                onInput={(e) => {
                                    e.currentTarget.value  = e.currentTarget.value.toUpperCase().trim();
                                }}
                                {...register("curp", {
                                    maxLength: {
                                        value: 18,
                                        message: "La CURP no es válida"
                                    },
                                    minLength: {
                                        value: 18,
                                        message: "La CURP no es válida"
                                    },
                                    pattern: {
                                        value: curpRegex,
                                        message: "La CURP no es válida"
                                    }
                                })}
                            />
                            {errors.curp && <MessageErrors>{errors.curp.message}</MessageErrors>}
                        </div>

                        <div className="space-y-2">
                            <Input 
                                type="text"
                                name="address"
                                value={address}
                                disabled
                            />
                            <Input id="lat" type="hidden" {...register("lat", {required: "Selecciona una ubicacion"})} />
                            <Input id="lng" type="hidden" {...register("lng", {required: "Selecciona una ubicacion"})} />
                            {(errors.lat || errors.lng) && <MessageErrors>Selecciona una ubicacion</MessageErrors>}

                            <Button
                                type="button"
                                className="w-full h-11 flex items-center justify-center"
                                variant="secondary"
                                onClick={() => setOpenModal(true)}
                            >
                                Selecciona tu ubicación*
                            </Button>
                        </div>

                        <Button 
                            type="submit" 
                            className={`w-full h-11 flex items-center justify-center ${isSubmitting && "disabled:opacity-60 disabled:cursor-not-allowed transition-all"}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/auth/login" className="text-primary font-medium hover:underline">
                            Inicia sesión
                        </Link>
                    </div>
                </CardFooter>

                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                >
                    <div className="space-y-1">
                        <CardTitle className="text-2xl">Ubicación</CardTitle>
                        <CardDescription>Selecciona tu ubicación para ver los incidentes cercanos</CardDescription>
                    </div>

                    <div className="flex items-center justify-between my-2">
                        <p className="text-sm md:text-base font-medium select-none">Usar ubicación en tiempo real</p>
                        <Toggle
                            enabled={mode}
                            setModeTrue={() => getPosition() }
                            setModeFalse={() => setMode(false) }
                        />
                    </div>

                    <Label className="text-muted-foreground">{address}</Label>

                    <Map 
                        position={position}
                        onDragend={getManualPosition}
                    />

                    <Button
                        type="button"
                        className="w-full h-11 flex items-center justify-center"
                        onClick={() => setOpenModal(false)}
                    >
                        Continuar
                    </Button>
                </Modal>
            </Card>
        </>
    )
}