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
import Notifications from "./view/Notifications";
import { MapFeed } from "./view/MapFeed/MapFeed";
import CreateAlias from "./view/profile/CreateAlias";
import { LayoutGPS } from "./layout/LayoutGPS";
import LayoutPublicApp from "./layout/LayoutPublicApp";
import PublicPost from "./view/public/PublicPost";

export default function Router() {
    return (
        <Routes>
            <Route path="/auth" element={<LayoutAuth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="confirm-account" element={<ConfirmAccount />} />
                <Route path="google-callback" element={<LoadUserProfile />} />
            </Route>
            
            <Route element={<LayoutApp />}>
                <Route element={<LayoutProtectedRoute />}>
                    <Route element={<LayoutGPS />}>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/map" element={<MapFeed />} />
                        <Route path="/create-report" element={<CreateReport />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/post/:tipo/:id" element={<Post />} />
                        <Route path="/notifications" element={<Notifications />}/>
                        <Route path="/create-alias" element={<CreateAlias />}/>
                    </Route>
                </Route>          
            </Route>

            <Route element={<LayoutPublicApp />}>
                <Route path="/post/public/:id" element={<PublicPost />} />
            </Route>
        </Routes>
    )
}