import { Route, Routes } from "react-router-dom";
import LayoutAuth from "./layout/auth/LayoutAuth";
import Login from "./view/auth/Login";
import Register from "./view/auth/Register";
import ConfirmAccount from "./view/auth/ConfirmAccount";
import LayoutApp from "./layout/LayoutApp";
import Inicio from "./view/Inicio";
import CreateReport from "./view/CreateReport";

export default function Router() {
    return (
        <Routes>
            <Route path="/auth" element={<LayoutAuth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="confirm-account" element={<ConfirmAccount />} />
            </Route>

            <Route element={<LayoutApp />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/create-report" element={<CreateReport />} />
            </Route>
        </Routes>
    )
}