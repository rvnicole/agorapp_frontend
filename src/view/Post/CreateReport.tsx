import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import CapturedImgs from "../../components/post/CapturedImgs";
import { createPost } from "../../api/PostAPI";
import Permissions from "../../components/permissons/Permissions";

export default function CreateReport() {
    const [ready, setReady] = useState(false);
    const { showMessages } = useAppStore(state => state);
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            showMessages("success", "Reporte creado");
            navigate(`/post/reporte/${data.id}?createdAt=${data.createdAt}`);
        },
        onError: (error) => {
            if("messages" in error && Array.isArray(error.messages)) {
                error.messages.forEach((error: string) => {
                    showMessages("error", error);
                }); 
            }
        }
    });

    if( !ready ) return (<Permissions onGranted={() => setReady(true)} />);
    return (
        <div className="flex items-center justify-center w-full">
            <Card className="border w-full md:w-3xl">
                <CardHeader className="space-y-1">
                   <CardTitle className="text-2xl">Creá un Reporte</CardTitle>
                   <CardDescription></CardDescription>
                </CardHeader>
                
                <CardContent>
                    <div id="CapturedImgs">
                        <CapturedImgs /> 
                    </div>
                </CardContent>                
            </Card>
        </div>
    )
}