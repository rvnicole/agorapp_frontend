import { Route, Routes } from "react-router-dom";
import LayoutAuth from "./layout/auth/LayoutAuth";
import Login from "./view/auth/Login";
import Register from "./view/auth/Register";
import ConfirmAccount from "./view/auth/ConfirmAccount";
import LayoutApp from "./layout/LayoutApp";
import Inicio from "./view/Inicio";
import CreateReport from "./view/Post/CreateReport";
import Post from "./view/Post/Post";
import LoadUserProfile from "./view/auth/LoadUserProfile";
import LayoutProtectedRoute from "./layout/auth/LayoutProtectedRoute";
import { Profile } from "./view/profile/Profile";

export default function Router() {
    return (
        <Routes>
            <Route path="/auth" element={<LayoutAuth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="confirm-account" element={<ConfirmAccount />} />
                <Route path="google-callback" element={<LoadUserProfile />} />
            </Route>

           
            {/*<Route element={<LayoutProtectedRoute />}>*/}
                <Route element={<LayoutApp />}>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/create-report" element={<CreateReport />} />
                    <Route path="/post/:tipo/:id" element={<Post />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            {/*</Route>*/}
        </Routes>
    )
}