import { Content, Icon, Item, ItemIndicator, ItemText, Portal, Root, Trigger, Value, Viewport } from "@radix-ui/react-select";
import { CheckIcon, ChevronDown } from "lucide-react";

type SelectProps = {
    value?: string,
    onChange: (value: string) => void,
    placeholder: string,
    children: React.ReactNode
}

export function Select({ value, onChange, placeholder, children, ...rest }: SelectProps) {
    return (
        <Root
            data-slot="select"
            value={value}
            onValueChange={onChange}
            {...rest}
        >
            <Trigger
                className="w-full border border-input flex items-center justify-between gap-2 rounded-lg bg-card 
                px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none 
                disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground 
                focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50
                cursor-pointer dark:bg-input/30 dark:hover:bg-input/50"
            >
                <Value placeholder={placeholder} />

                <Icon asChild>
                    <ChevronDown className="size-4 opacity-50" />
                </Icon>
            </Trigger>

            <Portal>
                <Content
                    position="popper"
                    className="bg-popover/20 text-popover-foreground backdrop-blur-lg relative z-50 w-full 
                    max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) 
                    overflow-x-hidden rounded-lg border shadow-md fade-in"
                >
                    <Viewport
                        className="min-w-(--radix-select-trigger-width) scroll-my-1 p-1"
                    >
                        <div className="max-h-60 overflow-y-auto overflow-x-hidden scroll-my-1 p-1">
                            {children}
                        </div>                        
                    </Viewport>
                </Content> 
            </Portal>
        </Root>
    )
}

type SelectItemProps = {
    value: string,
    text: string,
    className?: string
}

export function SelectItem({value, className, text }: SelectItemProps) {
    return (
        <Item
            value={value}
            className={`focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer 
            items-center gap-2 rounded-lg px-3 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none 
            data-disabled:opacity-50 ${className}`}
        >
            <ItemText>{text}</ItemText>
            <ItemIndicator>
                <CheckIcon className="size-4" />
            </ItemIndicator>
        </Item>
    )
}