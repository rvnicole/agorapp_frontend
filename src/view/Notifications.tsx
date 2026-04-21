import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMessageStore } from "../store/messageStore";
import TitleSection from "../components/ui/TitleSection";
import Notificacion from "../components/notification/Notificacion";
import Spinner from "../components/ui/Spinner";
import { APIAgorAppError } from "../errors/ApiError";
import { getNotifications } from "../api/notificationsAPI";
import { Bell } from "lucide-react";
import type { Notification } from "../types";

export default function Notifications() {
    const { showMessages } = useMessageStore( state => state );
    const spinner = useRef<HTMLDivElement>(null);
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isError } = useInfiniteQuery({
        queryKey: ["get-notifications"],
        queryFn: ({ pageParam }) => getNotifications({ createdAt: pageParam }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            if( !lastPage?.length ) return undefined;

            const lastNotification = lastPage[lastPage.length - 1];
            return lastNotification.notification_created_at;
        }
    });

    const notificaciones = useMemo(() => data?.pages.flat() || [], [data]);

    useEffect(() => {
        if ( isError && error instanceof APIAgorAppError) {
            error.messages.forEach((error: string) => showMessages("error", error));
        }
    }, [isError, error]);

    useEffect(() => {
        const observador = new IntersectionObserver(arreglo => {
            if( arreglo[0].isIntersecting && hasNextPage && !isFetchingNextPage ) {
                fetchNextPage();
            }
        });

        if(spinner.current) observador.observe( spinner.current );

        return () => observador.disconnect();
    }, [spinner, hasNextPage, isFetchingNextPage]);
    
    return (
        <div className="m-auto mt-5 md:w-3xl md:mt-0">
            <div className="space-y-5">
                <TitleSection 
                    icon={<Bell className="h-5 w-5"/>}
                    title="Notificaciones"
                />

                <div className="w-full space-y-3">
                    { notificaciones?.map((notificacion: Notification) => (
                        <Notificacion key={notificacion.receptor_id} notificacion={notificacion} />
                    ))}
                </div>                
            </div>         

            { hasNextPage &&
                <div ref={spinner} className="flex justify-center">
                    <Spinner />
                </div>
            }   
        </div>
    )
}