import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { createPost } from "../../api/PostAPI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import PostForm from "../../components/post/postCreateEdit/PostForm";
import Modal from "../../components/ui/Modal";
import MessagePermissions from "../../components/MessagePermissions";
import { Loader2 } from "lucide-react";
import type { Post } from "../../types";

export default function CreateReport() {
    const [openModal, setOpenModal] = useState(false); // Abrir o Cerrar Modal
    const { status, loading, hasAllGranted, hasAnyDenied, check, request } = usePermissions();
    const { showMessages } = useAppStore(state => state);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const current = await check();
            console.log("Current", current);

            if ( !hasAllGranted ){
                setOpenModal(true);
            }
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
        const res = await request();
        
        if( res && res.success ) {
            setOpenModal(false);
        }       
    }

    return (
        <div className="flex items-center justify-center w-full">
            <Card className="border w-3xl">
                <CardHeader className="space-y-1">
                   <CardTitle className="text-2xl">Creá un Reporte</CardTitle>
                   <CardDescription></CardDescription>
                </CardHeader>

                <CardContent>
                    <PostForm 
                        tipo="reporte"
                        onSubmit={(report: Post) => mutate(report) } 
                    />
                </CardContent>                
            </Card>
            

            <Modal
                open={openModal}
                onClose={() => navigate("/")}
            >
                { status && (
                    <MessagePermissions 
                        camera={status.camera}
                        microphone={status.microphone}
                        location={status.location}
                    />
                )}

                { status && !hasAnyDenied && (
                    <Button
                        type="button"
                        className="flex justify-center items-center"
                        variant="default"
                        size="default"
                        onClick={handleRequestPermissions}
                    >
                        { loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                "Solicitando..."
                            </>
                        ) : "Continuar"}
                    </Button>
                )}
            </Modal>
        </div>
    )
}