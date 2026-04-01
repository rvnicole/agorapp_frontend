import { ArrowLeft } from "lucide-react";
import { Button } from "../../ui/Button"

type DescriptionComparisonProps = {
    original: string;
    improved: string;
    onSelect: (value: string) => void;
    onRetry: () => void;
}

export default function DescriptionComparison({ original, improved, onSelect, onRetry }: DescriptionComparisonProps) {
    return (
        <div className="relative w-screen p-10 flex flex-col gap-5 max-h-screen overflow-y-auto select-none animate-traslate">
            <div className="text-center">
                <p className="text-2xl text-foreground font-bold">Elige la descripción</p>
                <p className="text-lg text-foreground font-semibold">Puedes usar tu descripción o una versión sugerida</p>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
                <div
                    className="w-full p-5 border rounded-xl cursor-pointer hover:scale-[102%] hover:border-primary group"
                    onClick={() => onSelect(original)}
                >
                    <p className="font-semibold mb-2 group-hover:text-primary">Tu descripción</p>
                    <p> {original} </p>
                </div>

                <div
                    className="w-full p-5 border rounded-xl cursor-pointer hover:scale-[102%] hover:border-primary group"
                    onClick={() => onSelect(improved)}
                >
                    <p className="font-semibold mb-2 group-hover:text-primary">Descripción sugerida</p>
                    <p> {improved} </p>
                </div>
            </div>

            <Button
                type="button"
                variant="secondary"
                className="flex items-center justify-center gap-1 m-auto w-full md:w-md"
                onClick={ () => onRetry() }
            >
                <ArrowLeft className="h-5 w-5"/>
                Volver a grabar
            </Button>
        </div>
    )
}