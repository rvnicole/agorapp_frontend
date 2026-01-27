import PostForm from "../components/post/PostForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { useAppStore } from "../store/appStore";
import type { NewReport } from "../types";


export default function CreateReport() {
    const { showMessages } = useAppStore(state => state);

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
                        onSubmit={(report: NewReport) => {
                            console.log("Creando...", report);
                            showMessages("success", "Reporte Creado");
                        }} 
                    />
                </CardContent>                
            </Card>
        </div>
    )
}