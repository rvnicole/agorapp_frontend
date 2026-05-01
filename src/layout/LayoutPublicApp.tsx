import { Outlet, useNavigate } from "react-router-dom";
import { useAuthModalStore } from "../store/authModalStore";
import { Button } from "../components/ui/Button";
import Title from "../components/layout/Title";
import Encabezado from "../components/ui/Encabezado";
import MenuPublic from "../components/layout/MenuPublic";
import ThemeSelector from "../components/layout/ThemeSelector";
import ButtonCreate from "../components/layout/ButtonCreate";
import Navbar from "../components/layout/Navbar";
import Modal from "../components/ui/Modal";

const messages = {
    default: {
        title: "Únete a tu comunidad",
        description: "Crea una cuenta para comentar, apoyar reportes y recibir actualizaciones."
    },
    create: {
        title: "Haz escuchar tu voz",
        description: "Regístrate para compartir reportes y alertar a tu comunidad."
    },
    support: {
        title: "Haz visible este reporte",
        description: "Regístrate para apoyar reportes y ayudar a que tengan más impacto."
    },
    comments: {
        title: "Únete para comentar en este reporte",
        description: "Participa en la conversación, aporta información y ayuda a tu comunidad."
    },
}

export default function LayoutPublicApp() {
    const { openModal, action, setOpenModal, setAction } = useAuthModalStore( state => state );
    const navigate = useNavigate();

    const handleClickCreate = () => {
        setOpenModal(true);
        setAction("create");
    }

    return (
        <div>
            <Encabezado>
                <div className="flex items-center gap-3">
                    <MenuPublic />
                    <Title />
                </div>

                <ThemeSelector />
            </Encabezado>

            <main  className="w-full m-auto md:px-4 md:py-6">
                <div className="h-full bg-background pb-20 md:pb-8">
                    <Outlet />

                    <ButtonCreate
                        text="Crear un reporte"
                        onClick={handleClickCreate}
                    />
                </div>

                <Navbar onCreate={handleClickCreate} /> 
            </main>

            <Modal 
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <div className="space-y-3">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">AgoraApp</h2>
                        <p className="text-primary font-semibold">{messages[action].title}</p>
                        <p className="text-sm text-muted-foreground font-semibold">{messages[action].description}</p>
                    </div>

                    <Button 
                        className="flex items-center justify-center w-full"
                        onClick={() => navigate("/auth/login")}
                    >
                        Iniciar sesión / Crear cuenta
                    </Button>

                    <Button 
                        variant="secondary"
                        className="flex items-center justify-center w-full"
                        onClick={() => setOpenModal(false)}
                    >
                        Ahora no
                    </Button>
                </div>              
            </Modal>
        </div>
    )
}