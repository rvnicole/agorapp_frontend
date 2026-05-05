import axios from "axios";
import type { PostResumeProps } from "../components/post/postFeed/PostResume";

export function useShare(){
    const sharePost = async (postResumeData: PostResumeProps) => {
        const tituloCompartido = postResumeData.titulo ? postResumeData.titulo : "Reporte Agorapp";
        const url = `/post/${postResumeData.tipo}/${postResumeData.id}?createdAt=${encodeURIComponent(postResumeData.created_at)}&public=true`;
        if( postResumeData.imagenes && postResumeData.imagenes.length > 0 ){
            console.log("Entra");
            const imgBlob = await axios.get(postResumeData.imagenes[0].urlImg, {
                responseType: "blob",
                timeout: 4000
            });
            const imagen = new File(
                [imgBlob.data],
                "reporte-agorapp.webp",
                { type: imgBlob.data.type }
            );
            if( "share" in navigator ) {
                navigator.share({
                    title: tituloCompartido,
                    text: postResumeData.descripcion,
                    url,
                    files: [imagen]
                });
            }
        }
        else if( "share" in navigator ){
            navigator.share({
                title: tituloCompartido,
                text: postResumeData.descripcion,
                url
            });
        };
    };

    return { sharePost }
};