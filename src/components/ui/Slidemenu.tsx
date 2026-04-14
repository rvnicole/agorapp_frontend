import { Close, Content, Description, Overlay, Portal, Root, Title, Trigger } from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";

export function Slidemenu({ children, ...rest}: ComponentProps<typeof Root>) {
    return (
        <Root data-slot="Slide-menu" {...rest}>
            {children}
        </Root>
    )
}

export function SlidemenuTrigger({ children, ...rest}: ComponentProps<typeof Trigger>) {
    return (
        <Trigger data-slot="Slide-menu-trigger" {...rest}>
            {children}
        </Trigger>
    )
}

export function SlidemenuClose({ children, ...rest }: ComponentProps<typeof Close>) {
    return (
        <Close data-slot="Slide-menu-close" {...rest}>
            {children}
        </Close>
    )
}

export function SlidemenuDescription({ children, ...rest }: ComponentProps<typeof Description>) {
    return (
        <Description data-slot="Slide-menu-Description" {...rest}>
            {children}
        </Description>
    )
}

export function SlidemenuTitle({ children, ...rest }: ComponentProps<typeof Title>) {
    return (
        <Title data-slot="Slide-menu-title" {...rest}>
            {children}
        </Title>
    )
}

const sideStyle = {
    top: "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    bottom: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    left: "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
}

export function SlidemenuContent({ className, children, side, ...rest }: ComponentProps<typeof Content> & { side: "top"|"right"|"bottom"|"left" }) {
    return (
        <Portal data-slot="Slide-menu-portal">
            <Overlay 
                data-slot="Slide-menu-overlay"
                className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            >
                <Content 
                    data-slot="Slide-menu-content"
                    className={`fixed z-50 flex flex-col shadow-lg h-full w-64 bg-popover text-popover-foreground
                    transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500
                    data-[state=open]:animate-in data-[state=closed]:animate-out 
                    ${sideStyle[side]} ${className}`}
                    {...rest}
                >
                    {children}
                </Content>
            </Overlay>
        </Portal>
    )
}