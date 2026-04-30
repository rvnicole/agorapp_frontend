import { Link } from "react-router-dom";

type TitleProps = {
    link?: string;
}

export default function Title({ link }: TitleProps) {
    return (
        <h1 className="text-xl font-bold">
            { link ? 
                <Link to={link}>AgorApp</Link> 
                : 
                "AgorApp"
            }
        </h1>
    )
}