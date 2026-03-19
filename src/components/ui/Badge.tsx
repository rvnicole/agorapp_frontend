type BadgeProps = {
    className?: string;
    children: React.ReactNode;
}

export default function Badge({ className, children, ...props }: BadgeProps ) {
    return (
        <div
            data-slot="etiqueta"
            className={`inline-flex py-1 px-3 text-sm font-semibold rounded ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}