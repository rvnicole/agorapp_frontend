import { Card } from "../../ui/Card";
import { SeparatorHorizontal } from "../../ui/Separator";
import { formatDate } from "../../../utils/date";
import Avatar from "../../ui/Avatar";
import LikedPost from "./LikedPost";
import BadgeCategoria from "./BadgeCategoria";
import BadgeEstado from "./estados/BadgeEstado";
import { Calendar, MapPin } from "lucide-react";
import type { Estado, PostRespuesta } from "../../../types";
import MenuPost from "../postMenu/MenuPost";

type InformationPostProps = {
    post: PostRespuesta;
    estado?: Estado;
}

export default function InformationPost({ post, estado }: InformationPostProps) {
    return (
        <Card className="border p-5 w-full">
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start md:flex-row md:items-center gap-2">
                        { post.fk_categoria_id != null && <BadgeCategoria categoria={post.fk_categoria_id} />}
                        { estado && <BadgeEstado estado={estado.estado} />}
                    </div>

                    <MenuPost post={post} />               
                </div>

                <h1 className="text-2xl font-bold leading-tight">{post.titulo}</h1>
                <p className="text-muted-foreground leading-relaxed">{post.descripcion}</p>
                
                <LikedPost
                    id={post.id}
                    createdAt={post.created_at}
                    like={post.liked || false}
                    totalLikes={post.total_likes}
                />
            </div>

            <SeparatorHorizontal />

            <div className="flex flex-col gap-3 space-y-3">
                <div className="flex items-start gap-2">
                    <Avatar>
                        <img
                            className="w-full h-fit" 
                            src={post.url_img || "/public/user-avar-default.jpg"} 
                        />
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Reportado por</p>
                        <p className="text-sm text-muted-foreground">{post.alias}</p>
                    </div> 
                </div>

                <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Fecha de reporte</p>
                        <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                    </div> 
                </div>
                
                <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Ubicación</p>
                        <p className="text-sm text-muted-foreground">{post.direccion}</p>
                    </div> 
                </div>
            </div>
        </Card>
    )
}