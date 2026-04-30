import { useQuery } from "@tanstack/react-query"
import Modal from "../../ui/Modal";
import { type Dispatch, type SetStateAction } from "react";
import { getPosts } from "../../../api/PostAPI";
import type { RequestListPost } from "../../../types";
import PostWrapper from "./PostWrapper";

type NearPostProps = {
    comprobar: boolean,
    setComprobar: Dispatch<SetStateAction<boolean>>
}

export function NearPost({ lat, lng, setComprobar }: RequestListPost & NearPostProps){
    const { data, isPending, error } = useQuery({
        queryKey: ["getNearPost", lat, lng],
        queryFn: () => getPosts({ lat, lng, distancia: "5" }),
        gcTime: 600000
    });

    if(error) return <Modal open={true} onClose={() => {}}><p>{"error:"} { error.message }</p></Modal>
    if(isPending) return <Modal open={true} onClose={() => {}}><p>Verificando publicaciones cercanas...</p></Modal>
    if( data && data.length ) return (
        <Modal
            open={true}
            onClose={() => {
                setComprobar(false);
            }}
        >
            <div className="mt-3 overflow-auto h-[70dvh]  space-y-3 py-5 px-2">
                <h3 className="mt-0 font-light ">Es posible que ya haya un reporte para esto.</h3>
                {
                    data.map( post => {
                        return <PostWrapper key={post.id} postResumeData={post} comprobacion={true}/>
                    })
                }
            </div>
        </Modal>
    )
};