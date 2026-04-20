import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Mail, Bell, Calendar, Megaphone, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Toggle } from "../../components/ui/Toggle";
import Avatar from "../../components/ui/Avatar";
import { useUserStore } from "../../store/userStore";
import Badge from "../../components/ui/Badge";
import { roles } from "../../data/roles";
import { formatDate } from "../../utils/date";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getUserPosts } from "../../api/PostAPI";
import Spinner from "../../components/ui/Spinner";
import useNotification from "../../hooks/useNotifications";
import AdjustmentHorizontal from "../../components/ui/AdjustmentHorizontal";
import { useMessageStore } from "../../store/messageStore";
import { updateImageProfile } from "../../api/userAPI";
import type { UploadImageProfile } from "../../types";
import PostWrapper from "../../components/post/postFeed/PostWrapper";

const preferenciasNotificaciones = [
    { titulo: "Notificaciones", descripcion: "Recibe notificaciones en tu dispositivo", estilos: "" },
    //{ titulo: "Notificaciones de reacciones de apoyo", descripcion: "Notificar cuando alguien apoye tu publicación", estilos: "py-5 border-b" },
    //{ titulo: "Notificaciones de nuevos comentarios", descripcion: "Notificar cuando alguien comente tu publicación", estilos: "py-5 border-b" },
    //{ titulo: "Notificaciones de cambios de estado", descripcion: "Recibe notificaciones cuando tu publicación tenga un cambio de estado", estilos: "pt-5" }
];

export function Profile(){
    const ref = useRef(null);
    const [shouldFetch, setShouldFetch] = useState(false);
    const { user, setUserData } = useUserStore( state => state );
    const { checkNotificationPermission, deactivateNotifications } = useNotification();
    const { showMessages } = useMessageStore();
    
    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["getUserPosts"],
        queryFn: ({ pageParam }) => getUserPosts(pageParam),
        initialPageParam: new Date().toISOString(),
        getNextPageParam: (lastPage) => {
            if( !lastPage?.length ) return undefined;
            return lastPage[lastPage.length - 1].created_at;
        },
        enabled: shouldFetch,
        gcTime: 30 * 60 * 1000
    });

    const { mutate, isPending: isPendingMutate } = useMutation({
        mutationKey: ["upload-image"],
        mutationFn: updateImageProfile,
        onError: (error) => {
            showMessages("error", error.message);
        },
        onSuccess: (data: UploadImageProfile) => {
            const dataUser = JSON.parse(localStorage.getItem("userData")!);
            const newDataUser = { ...dataUser, url_img: data.url_img + "?t=" + Date.now()  };
            setUserData({...newDataUser });
            localStorage.setItem("userData", JSON.stringify(newDataUser));
            showMessages("success", "Imagen actualizada");
        }
    });

    useEffect(() => {
        const observador = new IntersectionObserver((elementos) => {
            if(elementos[0].isIntersecting){
                if( !data ) {
                    setShouldFetch(true);
                    return;
                }
                fetchNextPage();
            };
        });
        if(ref.current) observador.observe(ref.current);

        return () => observador.disconnect();
    },[isPending, isFetchingNextPage]);

    const handleSelectImage = async (e: ChangeEvent<HTMLInputElement>) => {
        console.log({e});
        const { files } = e.target;
        if( files?.length && files.length > 0 ){
            const formData = new FormData();
            formData.append("imgs",files[0]);
            mutate(formData);
        }
    };
    
    return <div className=" space-y-7 flex flex-col justify-center items-center">
            <Card className="border w-full md:w-3xl">
                <CardHeader className="justify-center">
                    <div className="relative">
                        <Avatar className="size-32">
                            <img
                                className={`w-full h-fit`} 
                                src={`${user.url_img + "?t=" + Date.now()}`} 
                                alt="user-image" 
                            />
                        </Avatar>
                        <label
                            className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer"
                            
                        >
                        {
                            isPendingMutate ?
                                <Loader2 className="animate-spin text-primary-foreground" />
                            :
                                <>
                                    <Pencil className="text-primary-foreground"/>
                                    <input 
                                        type="file" 
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleSelectImage}
                                    />
                                </>
                        }
                        </label>
                    </div>
                    <CardTitle className="text-2xl text-center font-bold">{user.nombre}</CardTitle>
                    <div className="flex space-x-1 justify-center">
                        <h2 className="text-center">Alias:</h2>
                        <p className="font-semibold">{user.alias}</p>
                    </div>
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
                            <p>Miembro desde el {formatDate(user.createdAt)}</p>
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
                    <CardContent>
                        {
                            preferenciasNotificaciones.map( (tipoNotificacion) => 
                                <div
                                    key={tipoNotificacion.titulo} 
                                    className={`flex items-center justify-between ${tipoNotificacion.estilos}`}
                                >
                                    <p className="text-base font-semibold mr-5 w-3/4 md:w-auto">{tipoNotificacion.titulo}
                                        <span 
                                            className="block mt-1 text-sm font-normal text-muted-foreground"
                                        >{tipoNotificacion.descripcion}</span>
                                    </p>
                                    <Toggle 
                                        setModeFalse={async () => await deactivateNotifications() }
                                        setModeTrue={ async () => await checkNotificationPermission(Notification.permission)}
                                        isOn={ Notification.permission === "granted" && Boolean(localStorage.getItem("fb_token")) }
                                        disable={ Notification.permission === "denied" }
                                    />
                                </div>
                            )
                        }
                        {
                            Notification.permission === "denied" &&
                            <p className="text-xs pt-3 text-destructive">
                            Tienes las notificaciones bloqueadas. Para activarlas:
                            Haz clic en el candado en la barra de URL <span className="text-base"><AdjustmentHorizontal className="inline"/></span>
                            {" "} busca "Notificaciones"
                            y cámbialo a "Permitir"
                            luego recarga la página
                            </p>
                        }
                    </CardContent>
                </Card>
            </div>
            <section className="md:w-3xl w-full space-y-4 flex flex-col justify-center items-center">
                <div className="w-full flex justify-items-start space-x-2 px-2 pb-3">
                    <Megaphone className="size-6 text-base"/>
                    <p className="text-muted-foreground font-semibold">MIS ÚLTIMOS REPORTES</p>
                </div>
                
                {
                    data?.pages && data.pages.flat().map( userPost => { 
                        if( userPost ) return <PostWrapper key={"profile"+userPost.id} postResumeData={userPost}/>
                    })
                }
                
                <div ref={ref}>
                    {
                        (isPending || hasNextPage) && <div className="my-10"><Spinner /></div>
                    }
                </div>
            </section>
        </div>
}