import { useEffect, useState } from "react";
import { usePermissions } from "../../hooks/usePermissions";
import { useAppStore } from "../../store/appStore";
import { Button } from "../ui/Button";
import Modal from "../ui/Modal";
import MessagePermissions from "./MessagePermissions";
import { Loader2 } from "lucide-react";

const PERMISSION_ORDER = ["camera", "microphone", "location"] as const;

type PermissionsProps = {
    onGranted: () => void;
}

export default function Permissions({ onGranted }: PermissionsProps) {
    const { status, loading, check, request } = usePermissions();
    const { showMessages } = useAppStore(state => state);

    const [step, setStep] = useState(0);
    const currentPermission = PERMISSION_ORDER[step];
    
    useEffect(() => {
        (async () => {
            const current = await check();
            
            if( current[currentPermission] === "granted" ) {
                nextPermission();
            }
        })();
    }, [ step ]);

    const nextPermission = () => {
        if (step + 1 >= PERMISSION_ORDER.length) {
            onGranted();
        } 
        else {
            setStep(step + 1);
        }
    };

    const handleRequestPermissions = async () => {
        const res = await request(currentPermission);

        if( res?.success ) {
            nextPermission();
        }

        showMessages("error", res?.error);
    };
    
    if(status) return (
        <Modal
            open={ true }
            onClose={() => console.log("Cerrando...")}
        >              
            <MessagePermissions
                permiso={currentPermission}
                estado={status[currentPermission]}
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
        </Modal>
    )
}