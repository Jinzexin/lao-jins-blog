import { ReactNode } from "react";

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

/**
 * Client-side navigation helper.
 * In a static S3 site we use anchor tags for full page navigation.
 */
export function Link({ to, children, className }: LinkProps) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = to;
      }}
    >
      {children}
    </a>
  );
}