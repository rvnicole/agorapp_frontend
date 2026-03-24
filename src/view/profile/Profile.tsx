import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Toggle } from "../../components/ui/Toggle";
import Avatar from "../../components/ui/Avatar";
import { useUserStore } from "../../store/userStore";
import Badge from "../../components/ui/Badge";
import { roles } from "../../data/roles";

export function Profile(){
    const { user } = useUserStore( state => state );
    
    return <div className="flex justify-center align-center">
        <Card className="border w-3xl">
            <CardHeader className="justify-center">
                <Avatar className="size-32">
                    <img
                        className="w-fit h-fit" 
                        src={user.url_img} 
                        alt="user-image" 
                    />
                </Avatar>
                <CardTitle className="text-2xl text-center font-bold">{user.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Badge className="bg-secondary w-fit">
                    {user.rol && roles.esp[user.rol]}
                </Badge>
            </CardContent>
        </Card>
    </div>
}