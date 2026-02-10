import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import MessagePermissions from "../../components/MessagePermissions";
import CapturedImgs from "../../components/post/CapturedImgs";
import { createPost } from "../../api/PostAPI";
import { Loader2 } from "lucide-react";


export default function CreateReport() {
    const { status, loading, isChecking, hasAllGranted, hasAnyDenied, check } = usePermissions();
    const { showMessages } = useAppStore(state => state);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const current = await check();
            console.log("Current", current);
        })();
    }, []);

    const { mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            //console.log("Success: ", data);
            showMessages("success", "Reporte creado");
            navigate(`/post/reporte/${data.id}?createdAt=${data.createdAt}`);
        },
        onError: (error) => {
            if("messages" in error && Array.isArray(error.messages)) {
                //console.log(error.messages);
                error.messages.forEach((error: string) => {
                    showMessages("error", error);
                }); 
            }
        }
    });

    const handleRequestPermissions = async () => {
        //const res = await request();
        //if( res && res.success ) return;
        //navigate("/");
    };

    return (
        <div className="flex items-center justify-center w-full">
            <Card className="border w-full md:w-3xl">
                <CardHeader className="space-y-1">
                   <CardTitle className="text-2xl">Creá un Reporte</CardTitle>
                   <CardDescription></CardDescription>
                </CardHeader>
                
                <CardContent>
                    { hasAllGranted && (
                        <div id="CapturedImgs">
                            <CapturedImgs /> 
                        </div>
                    )}
                </CardContent>                
            </Card>
            

            <Modal
                open={ !isChecking && !hasAllGranted }
                onClose={() => navigate("/")}
            >
                k
            </Modal>
        </div>
    )
}