import { useQuery } from "@tanstack/react-query";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { SeparatorHorizontal } from "../../ui/Separator";
import { getAddress } from "../../../api/AddressAPI";
import { formatDate } from "../../../utils/date";
import Avatar from "../../ui/Avatar";
import { BadgeCategoria } from "../../ui/Badge";
import { Calendar, MapPin, ThumbsUp, UsersRound } from "lucide-react";
import type { PostRespuesta } from "../../../types";

type InformationPostProps = {
    post: PostRespuesta;
}

export default function InformationPost({ post }: InformationPostProps) {
    const { data: address } = useQuery({
        queryKey: ["get-address", { lat: post.lat, lng:post.lon }],
        queryFn: async () => {
            if( post.lat != null && post.lon != null ) {
                return getAddress({ lat: post.lat, lng:post.lon });
            }            
        }    
    });

    return (
        <Card className="border p-5 w-full">
            <div className="space-y-3">
                <div className="flex gap-2">
                    { post.fk_categoria_id != null && <BadgeCategoria categoria={post.fk_categoria_id} />}
                </div>

                <h1 className="text-2xl font-bold leading-tight">{post.titulo}</h1>
                <p className="text-muted-foreground leading-relaxed">{post.descripcion}</p>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <Button
                        className="flex justify-center items-center gap-3 w-full"
                    >
                        <ThumbsUp className={`h-5 w-5`} />
                        Apoyar
                    </Button>

                    <div className="flex flex-row md:flex-col gap-1 items-center justify-center">
                        <div className="flex items-center justify-center gap-1">
                            <UsersRound  className="h-5 w-5"/>
                            <p className="text-2xl font-bold">{post.total_likes}</p>
                        </div>
                        
                        <p className="text-center text-xs text-muted-foreground">Personas de acuerdo</p>
                    </div>
                </div>
            </div>

            <SeparatorHorizontal />

            <div className="flex flex-col gap-3 space-y-3">
                <div className="flex items-start gap-2">
                    <Avatar>
                        <img src="/public/user-avar-default.jpg"/>
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
                        <p className="text-sm text-muted-foreground">{address}</p>
                    </div> 
                </div>
            </div>
        </Card>
    )
}