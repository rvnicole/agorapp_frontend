import { useEffect, useRef, useState } from "react";
import { Mail, Bell, Calendar, Megaphone  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Toggle } from "../../components/ui/Toggle";
import Avatar from "../../components/ui/Avatar";
import { useUserStore } from "../../store/userStore";
import Badge from "../../components/ui/Badge";
import { roles } from "../../data/roles";
import { formatDate } from "../../utils/date";
import PostResume from "../../components/post/postResume/PostResume";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../api/PostAPI";
import Spinner from "../../components/ui/Spinner";
import type { PostsUsuarioRespuesta } from "../../types";

const preferenciasNotificaciones = [
    { titulo: "Notificaciones", descripcion: "Recibe notificaciones en tu dispositivo", estilos: "pb-5 border-b" },
    { titulo: "Notificaciones de reacciones de apoyo", descripcion: "Notificar cuando alguien apoye tu publicación", estilos: "py-5 border-b" },
    { titulo: "Notificaciones de nuevos comentarios", descripcion: "Notificar cuando alguien comente tu publicación", estilos: "py-5 border-b" },
    { titulo: "Notificaciones de cambios de estado", descripcion: "Recibe notificaciones cuando tu publicación tenga un cambio de estado", estilos: "pt-5" }
];

export function Profile(){
    const ref = useRef(null);
    const [shouldFetch, setShouldFetch] = useState(false);
    const { user } = useUserStore( state => state );
    
    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["getUserPosts"],
        queryFn: ({ pageParam }) => getUserPosts(pageParam),
        initialPageParam: new Date().toISOString(),
        getNextPageParam: (lastPage) => {
            if( !lastPage?.length ) return undefined;
            return lastPage[lastPage.length - 1].created_at;
        },
        enabled: shouldFetch
    });

    useEffect(() => {
        const observador = new IntersectionObserver((elementos) => {
            if(elementos[0].isIntersecting){
                console.log("Se esta viendo");
                console.log({ data, hasNextPage, isFetchingNextPage, isPending })
                if( !data ) {
                    console.log("Primera peticion");
                    setShouldFetch(true);
                    return;
                }
                fetchNextPage();
            };
        });
        if(ref.current) observador.observe(ref.current);

        return () => observador.disconnect();
    },[isPending, isFetchingNextPage]);
    
    return <div className="space-y-7 flex flex-col justify-center items-center">
        <Card className="border w-full md:w-3xl">
            <CardHeader className="justify-center">
                <Avatar className="size-32">
                    <img
                        className="w-full h-fit" 
                        src={user.url_img} 
                        alt="user-image" 
                    />
                </Avatar>
                <CardTitle className="text-2xl text-center font-bold">{user.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center">
                <Badge className="bg-secondary w-fit">
                    {user.rol && roles.esp[user.rol]}
                </Badge>
                <div className="mt-7 w-full text-sm space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <Mail className="size-5"/>
                        <p>{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="size-5"/>
                        <p>{formatDate(user.createdAt)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <div className="md:w-3xl w-full">
            <div className="flex space-x-2 px-2 pb-3">
                <Bell className="size-6 text-base"/>
                <p className="text-muted-foreground font-semibold">PREFERENCIAS DE NOTIFICACIONES</p>
            </div>
            <Card className="border">
                <CardContent className="">
                    {
                        preferenciasNotificaciones.map( tipoNotificacion => 
                            <div
                                key={tipoNotificacion.titulo} 
                                className={`flex items-center justify-between pb-5 ${tipoNotificacion.estilos}`}
                            >
                                <p className="text-base font-semibold mr-5 w-3/4 md:w-auto">{tipoNotificacion.titulo}
                                    <span 
                                        className="block mt-1 text-sm font-normal text-muted-foreground"
                                    >{tipoNotificacion.descripcion}</span>
                                </p>
                                <Toggle 
                                    setModeFalse={()=>{}}
                                    setModeTrue={()=>{}}
                                />
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        </div>
        <div className="md:w-3xl w-full space-y-4 flex flex-col justify-center items-center">
            <div className="w-full flex justify-items-start space-x-2 px-2 pb-3">
                <Megaphone className="size-6 text-base"/>
                <p className="text-muted-foreground font-semibold">MIS ÚLTIMOS REPORTES</p>
            </div>
            {
                data?.pages && data.pages.flat().map( userPost => { 
                    if( userPost ) return <PostResume key={userPost.id} postResumeData={userPost}/>
                })
            }
            <div ref={ref}>
                {
                    (isPending || hasNextPage) && <Spinner />
                }
            </div>
        </div>
    </div>
}