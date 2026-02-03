type AvatarProps = {
    className?: string;
    children: React.ReactNode
}

export default function Avatar({ className, children, ...props }: AvatarProps) {
    return (
        <div 
            data-slot="avatar"
            className={`relative flex size-8 shrink-0 overflow-hidden rounded-full`}
            {...props}
        >
            {children}
        </div>
    )
}