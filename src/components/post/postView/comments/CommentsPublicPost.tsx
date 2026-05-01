import TitleSection from "../../../ui/TitleSection";
import { MessageCircle } from "lucide-react";
import type { Post } from "../../../../types";

type CommentsPublicPostProps = {
    totalComentarios: Post["totalComentarios"];
}

export default function CommentsPublicPost({ totalComentarios }: CommentsPublicPostProps) {
    return (
        <div id="comentarios-public-post" className="w-full space-y-3">
            <TitleSection
                icon={<MessageCircle className="h-5 w-5" />}
                title={`Comentarios (${totalComentarios})`}
            />
        </div>
    )
}