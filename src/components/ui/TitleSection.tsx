type TitleSectionProps = {
    title: string;
    icon?: React.ReactNode;
    className?: string;
}

export default function TitleSection({ title, icon, className, ...rest }: TitleSectionProps) {
    return (
        <div 
            className={`flex items-center gap-2 ml-4 md:ml-0 ${className}`}
            {...rest}
        >
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
    )
}