type SpinnerProps = {
    text?: string;
}

export default function Spinner({ text }: SpinnerProps) {
    return (
        <div className="inline-flex items-center gap-2">
            <div className="spinner text-primary">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>

            { text && <p className="text-primary font-semibold">{text}</p>}
        </div>
        
    )
}