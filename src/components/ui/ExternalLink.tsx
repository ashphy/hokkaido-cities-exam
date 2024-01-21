import { ExternalLink } from "lucide-react";
import React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
}

export const ExternalLinkComponent = ({ href, children }: Props) => {
  return (
    <a
      className="inline-flex items-center border-b border-slate-500"
      href={href}
    >
      {children}
      <ExternalLink size="1rem" className="mx-1" />
    </a>
  );
};
