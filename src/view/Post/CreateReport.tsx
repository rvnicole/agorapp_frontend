import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import Permissions from "../../components/permissons/Permissions";
import CapturedImgs from "../../components/post/CapturedImgs";
import FullScreen from "../../components/ui/FullScreen";
import { createPost } from "../../api/PostAPI";
import RecordDescription from "../../components/post/RecordDescription";
import type { ApiErrorType } from "../../types";

export default function CreateReport() {
    const [ready, setReady] = useState(false);
    const [section, setSection] = useState<"images"|"description"|"location"|"general">("images");
    const { showMessages } = useMessageStore(state => state);
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            showMessages("success", "Reporte creado");
            navigate(`/post/reporte/${data.id}?createdAt=${data.createdAt}`);
        },
        onError: (error: ApiErrorType) => {
            error.messages.forEach((error: string) => {
                showMessages("error", error);
            });
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
                    <FullScreen
                        open={true}
                        onClose={() => navigate("/")}
                    >
                        { section === "images" && 
                            <CapturedImgs 
                                next={(imgs) => { 
                                    console.log(imgs);
                                    setSection("description");
                                }}
                            /> 
                        }

                        { section === "description" && 
                            <RecordDescription 
                                next={(descripcion) => { 
                                    console.log(descripcion);
                                    setSection("description");
                                }}
                            />
                        }
                    </FullScreen>


                </CardContent>                
            </Card>
        </div>
    )
}