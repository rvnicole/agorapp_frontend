import { Outlet } from "react-router-dom";
import { useAppStore } from "../../store/appStore";

export default function LayoutAuth() {
    const { setTheme } = useAppStore(state => state);

    return (
        <div>
            <main>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}