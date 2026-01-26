import { Link } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
                <div>
                    <h1 className="text-xl font-bold">
                        <Link to="/">
                            AgorApp
                        </Link>
                    </h1>
                </div>

                <div>
                    <ThemeSelector />
                </div>
            </div>
        </header>
    )
}