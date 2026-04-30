type HeaderProps = {
    children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
    return (
        <header 
            data-slot="encabezado"
            className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
        >
            <div className="flex h-14 items-center justify-between px-4">                
                {children}
            </div>
        </header>
    )
}