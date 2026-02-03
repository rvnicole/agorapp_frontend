type SeparatorProps = {
    className?: string,
}

export function SeparatorHorizontal({ className, ...rest }: SeparatorProps) {
    return (
        <div className={`bg-border w-full h-0.5 rounded-full ${className}`}/>
    )
}