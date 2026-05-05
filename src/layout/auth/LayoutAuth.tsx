import { Outlet } from "react-router-dom";

export default function LayoutAuth() {

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