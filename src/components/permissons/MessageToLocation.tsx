import Logout from "../layout/Logout";
import { Button } from "../ui/Button";

type MessageToLocationProps = {
    onContinue: () => void;
}

export default function MessageToLocation({ onContinue }: MessageToLocationProps) {
    return (
        <div className="w-full transition-all animate-traslate space-y-3">
            <p className="font-semibold text-foreground">¿Deseas continuar sin otorgar la ubicación?</p>
            
            <p className="text-sm font-semibold text-muted-foreground">
                Para poder navegar en AgoraApp es necesario conceder este permiso.
                Si decides no otorgarlo, no podrás continuar por ahora.
            </p>

            <p className="text-sm font-semibold text-muted-foreground">
                Puedes volver más tarde y activarlo cuando lo desees.
            </p>

            <div className="flex flex-col gap-2 w-full">
                <Button
                    type="button"
                    className="flex items-center justify-center"
                    onClick={onContinue}
                >
                    Conceder permiso
                </Button>

                <Logout
                    className="flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/60 h-9 px-4 py-2 rounded"
                >
                    Cerrar Sesión
                </Logout>
            </div>
        </div>
    )
}