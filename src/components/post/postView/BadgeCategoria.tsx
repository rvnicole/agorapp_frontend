import Badge from "../../ui/Badge";
import { categorias } from "../../../data/categorias";

export default function BadgeCategoria({ categoria, className }: { categoria: number, className?: string }) {
    return (
        <Badge
            data-slot="etiqueta-categoria"
            className={`bg-accent text-accent-foreground ${className}`}
        >
            <p>{categorias[categoria - 1].categoria}</p>
        </Badge>
    )
}