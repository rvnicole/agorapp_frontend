import { Outlet } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import Header from "../components/Header";

export default function LayoutApp() {
    const { setTheme } = useAppStore(state => state);

    return (
        <div>
            <Header />

            <main  className="container m-auto px-4 py-6">
                <div className="h-full bg-background pb-20 md:pb-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}