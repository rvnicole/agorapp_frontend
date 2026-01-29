import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../store/appStore";
import { createPost } from "../api/PostAPI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import PostForm from "../components/post/PostForm";
import type { Post } from "../types";

export default function CreateReport() {
    const { showMessages } = useAppStore(state => state);

    const { mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            console.log("Success: ", data);
            showMessages("success", "Reporte creado");
        },
        onError: (error) => {
            if("messages" in error && Array.isArray(error.messages)) {
                console.log(error.messages);
                error.messages.forEach((error: string) => {
                    showMessages("error", error);
                }); 
            }
        }
    });

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
        </div>
    )
}