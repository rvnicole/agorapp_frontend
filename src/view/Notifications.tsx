import { useQuery } from "@tanstack/react-query";
import TitleSection from "../components/ui/TitleSection";
import { Bell } from "lucide-react";
import { getNotifications } from "../api/notificationsAPI";
import Notificacion from "../components/notification/Notificacion";

export default function Notifications() {
    const { data: notificaciones } = useQuery({
        queryKey: ["get-notifications"],
        queryFn: () => getNotifications({  })
    });
    
    return (
        <div className="m-auto md:w-3xl">
            <div className="space-y-5">
                <TitleSection 
                    icon={<Bell className="h-5 w-5"/>}
                    title="Notificaciones"
                />

                <div className="w-full space-y-3">
                    { notificaciones?.map(notificacion => (
                        <Notificacion key={notificacion.receptor_id} notificacion={notificacion} />
                    ))}
                </div>
                
            </div>            
        </div>
    )
}