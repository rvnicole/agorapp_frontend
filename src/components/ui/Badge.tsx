import { categorias } from "../../data/categorias";

type BadgeProps = {
    className?: string;
    text: string;
}

export function Badge({ className, text, ...props }: BadgeProps ) {
    return (
        <div
            data-slot="etiqueta"
            className={`inline-flex py-1 px-3 text-sm font-semibold rounded-lg ${className}`}
            {...props}
        >
            <p>{text}</p>
        </div>
    )
}

export function BadgeCategoria({ categoria }: { categoria: number }) {
    return (
        <Badge
            data-slot="etiqueta-categoria"
            className="bg-accent text-accent-foreground"
            text={categorias[categoria].categoria}
        />
    )
}