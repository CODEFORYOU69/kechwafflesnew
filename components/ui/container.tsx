// app/components/ui/container.tsx
export function Container({
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`container px-4 md:px-6 mx-auto ${className || ""}`}
      {...props}
    />
  );
}
