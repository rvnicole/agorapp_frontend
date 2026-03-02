import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { Button } from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import MessagePermissions from "./MessagePermissions";
import MessageErrorPermissions from "./MessageErrorPermissions";
import { Loader2 } from "lucide-react";
import type { PermissionsError } from "../../types";

const PERMISSION_ORDER = ["camera", "microphone", "location"] as const;

type PermissionsProps = {
    onGranted: () => void;
}

export default function Permissions({ onGranted }: PermissionsProps) {
    const { status, isChecking, loading, hasAllGranted, check, request } = usePermissions();
    const navigate = useNavigate();

    const [rejectPermissions, setRejectpermissions] = useState<boolean>(false);
    const [errorPermission, setErrorpermission] = useState<PermissionsError|null>(null);
    const [step, setStep] = useState(0);
    const currentPermission = PERMISSION_ORDER[step];

    useEffect(() => {
        check();
    }, []);
    
    useEffect(() => {
        if (!status) return;
      
        if (status[currentPermission] === "granted") {
          nextPermission();
        }
    }, [step, status]);

    useEffect(() => {
        if (!isChecking && hasAllGranted) {
            onGranted();
        }
    }, [isChecking, hasAllGranted]);

    const nextPermission = () => {
        if (step + 1 >= PERMISSION_ORDER.length) {
            onGranted();
        } 
        else {
            setErrorpermission(null);
            setStep(step + 1);
        }
    };

    const handleRequestPermissions = async () => {
        const res = await request(currentPermission);

        if( res?.error) {
            setErrorpermission(res?.error);
            return;
        }

        nextPermission();
    };

    if( isChecking && !status ) {
        return ( 
            <div className="h-[75vh] flex justify-center">
                <Spinner />
            </div>
        );
    }

    if( status && !hasAllGranted ) {
        return (
            <Modal
                open={ true }
                onClose={() => setRejectpermissions(true)}
            > 
                { rejectPermissions ? 
                    <div className="w-full transition-all duration-700 ease-out animate-traslate space-y-3">
                        <p className="font-semibold text-foreground">¿Deseas continuar sin otorgar los permisos?</p>
                        <p className="text-sm font-semibold text-muted-foreground">
                            Para poder crear un reporte es necesario conceder estos permisos.
                            Si decides no otorgarlos, no podrás continuar con esta función por ahora.
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">
                            Puedes volver más tarde y activarlos cuando lo desees.
                        </p>

                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                type="button"
                                className="flex items-center justify-center"
                                onClick={() => setRejectpermissions(false)}
                            >
                                Conceder permisos
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                className="flex items-center justify-center"
                                onClick={() => navigate("/")}
                            >
                                Volver al inicio
                            </Button>
                        </div>
                    </div>
                    :
                    <div 
                        key={currentPermission}
                        className="flex flex-col gap-3 w-full transition-all duration-700 ease-out animate-traslate"
                    >
                        { errorPermission ? (
                            <MessageErrorPermissions
                                permiso={currentPermission}
                                error={errorPermission}
                            />
                        ) : (
                            <>
                                <MessagePermissions
                                    permiso={currentPermission}
                                />
                                
                                <Button
                                    type="button"
                                    className="flex justify-center items-center"
                                    onClick={handleRequestPermissions}
                                >
                                    { loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            "Solicitando..."
                                        </>
                                    ) : "Continuar"}
                                </Button>
                            </>                        
                        )}
                    </div> 
                }        
            </Modal>
        );
    }

    return null;
}