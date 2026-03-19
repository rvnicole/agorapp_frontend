import Badge from "../ui/Badge";
import { categorias } from "../../data/categorias";

export default function BadgeCategoria({ categoria }: { categoria: number }) {
    return (
        <Badge
            data-slot="etiqueta-categoria"
            className="bg-accent text-accent-foreground"
        >
            <p>{categorias[categoria - 1].categoria}</p>
        </Badge>
    )
}