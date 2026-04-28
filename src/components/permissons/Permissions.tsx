import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { Button } from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import MessagePermissions from "./MessagePermissions";
import MessageErrorPermissions from "./MessageErrorPermissions";
import MessageToCreate from "./MessageToCreate";
import MessageToLocation from "./MessageToLocation";
import { Loader2 } from "lucide-react";
import type { PermissionKey, PermissionsError } from "../../types";

type PermissionsProps = {
    onGranted: () => void;
    permissions: PermissionKey[]
}

export default function Permissions({ onGranted, permissions }: PermissionsProps) {
    const { status, isChecking, loading, hasAllGranted, check, request } = usePermissions();
    const navigate = useNavigate();

    const [rejectPermissions, setRejectpermissions] = useState<boolean>(false);
    const [errorPermission, setErrorpermission] = useState<PermissionsError|null>(null);
    const [step, setStep] = useState(0);

    const currentPermission = permissions[step];

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
        if ( !isChecking && hasAllGranted) {
            onGranted();
        }
    }, [isChecking, hasAllGranted]);

    const nextPermission = () => {
        console.log(currentPermission)
        if (step + 1 >= permissions.length) {
            console.log("Entra")
            onGranted();
        } 
        else {
            console.log("No")
            setErrorpermission(null);
            setStep(step + 1);
        }
    };

    const handleRequestPermissions = async () => {
        const res = await request(currentPermission);

        if( res?.error ) {
            setErrorpermission(res.error as PermissionsError);
            return;
        }

        nextPermission();
    };

    const closeModal = () => {
        if( currentPermission === "notification" ) {
            nextPermission();
            return;
        }

        setRejectpermissions(true);
    }

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
                onClose={closeModal}
            > 
                { rejectPermissions && (currentPermission === "camera" || currentPermission === "microphone") && 
                    <MessageToCreate 
                        onContinue={() => setRejectpermissions(false)}
                        onReturn={() => navigate(-1)}
                    />
                }

                { rejectPermissions && currentPermission === "location" &&
                    <MessageToLocation 
                        onContinue={() => setRejectpermissions(false)}
                    />
                }

                { !rejectPermissions &&
                    <div 
                        key={currentPermission}
                        className="flex flex-col gap-3 w-full transition-all animate-traslate"
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