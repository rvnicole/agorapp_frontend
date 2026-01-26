import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
    className?: string;
};

export function Card({ className, ...rest }: CardProps) {
    return (
      <div
        data-slot="card"
        className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm ${className}`}
        {...rest}
      />
    )
}

export function CardHeader({ className, ...rest }: CardProps) {
  return (
    <div
      data-slot="card-header"
      className={`@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 ${className}`}
      {...rest}
    />
  )
}

export function CardTitle({ className, ...rest }: CardProps) {
  return (
    <div
      data-slot="card-title"
      className={`leading-none font-semibold ${className}`}
      {...rest}
    />
  )
}

export function CardDescription({ className, ...rest }: CardProps) {
  return (
    <div
      data-slot="card-description"
      className={`text-muted-foreground text-sm ${className}`}
      {...rest}
    />
  )
}

export function CardAction({ className, ...rest }: CardProps) {
  return (
    <div
      data-slot="card-action"
      className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
      {...rest}
    />
  )
}

export function CardContent({ className, ...rest }: CardProps) {
  return (
    <div
      data-slot="card-content"
      className={`px-6 ${className}`}
      {...rest}
    />
  )
}

export function CardFooter({ className, ...rest }: CardProps) {
  return (
    <div
      data-slot="card-footer"
      className={`flex items-center px-6 [.border-t]:pt-6 ${className}`}
      {...rest}
    />
  )
}