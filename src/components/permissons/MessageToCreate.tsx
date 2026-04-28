import { Button } from "../ui/Button";

type MessageToCreateProps = {
    onContinue: () => void;
    onReturn: () => void;
}

export default function MessageToCreate({ onContinue, onReturn }: MessageToCreateProps) {
    return (
        <div className="w-full transition-all animate-traslate space-y-3">
            <p className="font-semibold text-foreground">¿Deseas continuar sin otorgar los permisos?</p>
            
            <p className="text-sm font-semibold text-muted-foreground">
                Para poder crear un reporte es necesario conceder estos permisos.
                Si decides no otorgarlos, no podrás continuar con esta función por ahora.
            </p>

            <p className="text-sm font-semibold text-muted-foreground">
                Puedes volver más tarde y activarlos cuando lo desees.
            </p>

            <div className="flex flex-col gap-2 w-full">
                <Button
                    type="button"
                    className="flex items-center justify-center"
                    onClick={onContinue}
                >
                    Conceder permisos
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    className="flex items-center justify-center"
                    onClick={onReturn}
                >
                    Volver
                </Button>
            </div>
        </div>
    )
}