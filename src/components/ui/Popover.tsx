import type { ComponentProps } from "react";
import { Content, Item, Portal, Root, Trigger } from "@radix-ui/react-dropdown-menu";

export function Popover({ children, ...rest }:  ComponentProps<typeof Root>) {
    return (
        <Root data-slot="popover" {...rest}>
            {children}   
        </Root>
    )
}

export function PopoverTrigger({ children, ...rest }:  ComponentProps<typeof Trigger>) {
    return (
        <Trigger data-slot="popver-trigger" asChild {...rest}>
            {children}
        </Trigger>
    )
}

export function PopoverContent({ children, className, ...rest }:  ComponentProps<typeof Content>) {
    return (
        <Portal data-slot="popover-portal">
            <Content
                align="end"
                forceMount
                className={`bg-popover/60 backdrop-blur-lg text-popover-foreground min-w-32 w-56 rounded-lg border p-1 shadow-md z-50 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto fade-in ${className}`}
                data-slot="popover-content"
                {...rest}
            >
                {children}
            </Content>
        </Portal>
    )
}

export function PopoverItem({ children, className, ...rest }: ComponentProps<typeof Item>) {
    return (
        <Item
            className={`flex items-center gap-3 cursor-pointer px-2 py-1 hover:bg-foreground/10 ${className}`}
            data-slot="popover-item"
            {...rest}
        >
            {children}
        </Item>
    )
}