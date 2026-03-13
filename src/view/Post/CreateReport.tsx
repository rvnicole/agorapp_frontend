import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../../store/messageStore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Permissions from "../../components/permissons/Permissions";
import CapturedImgs from "../../components/post/CapturedImgs";
import FullScreen from "../../components/ui/FullScreen";
import RecordDescription from "../../components/post/RecordDescription";
import PostForm from "../../components/post/postCreateEdit/PostForm";
import { createPost } from "../../api/PostAPI";
import type { ApiErrorType, DescriptionRespuesta, ImagenData, NewReport } from "../../types";

export default function CreateReport() {
    const [ready, setReady] = useState(false);
    const [section, setSection] = useState<"images"|"description"|"general">("images");
    const { showMessages } = useMessageStore(state => state);
    const navigate = useNavigate();

    const [report, setReport] = useState<NewReport>({
        titulo: "",
        descripcion: "",
        tipo: "reporte",
        categoriaId: 0,
        imgs: []
    });

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

    const handleNextImgs = ({ imagenes, position }: ImagenData) => {
        setSection("description");
        setReport(r =>({
            ...r, 
            imgs: imagenes,
            lat: position.lat,
            lng: position.lng
        }));
    }

    const handleNextDescription = (description: DescriptionRespuesta) => {
        setSection("general");
        setReport(r =>({...r, ...description }));
    }


    if( !ready ) return (<Permissions onGranted={() => setReady(true)} />);
    return (
        <div className="flex items-center justify-center w-full">
            <Card className="border w-full md:w-3xl">
                <CardHeader className="space-y-1">
                   <CardTitle className="text-2xl">Creá un Reporte</CardTitle>
                </CardHeader>
                
                <CardContent>
                    { section === "general" ? 
                        <PostForm
                            post={report}
                            tipo="reporte"
                            onSubmit={mutate}
                        />
                        :
                        <FullScreen
                            open={true}
                            onClose={() => navigate("/")}
                        >
                            { section === "images" && 
                                <CapturedImgs 
                                    next={handleNextImgs}
                                /> 
                            }

                            { section === "description" && 
                                <RecordDescription 
                                    next={handleNextDescription}
                                />
                            }
                        </FullScreen>
                    }
                </CardContent>                
            </Card>
        </div>
    )
}