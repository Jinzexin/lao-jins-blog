import { ReactNode } from "react";

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

/**
 * Client-side navigation helper.
 * In a static S3 site we use anchor tags for full page navigation.
 * This component provides a consistent interface for route changes.
 */
export function Link({ to, children, className }: LinkProps) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState({}, "", to);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }}
    >
      {children}
    </a>
  );
}