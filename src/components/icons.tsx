import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h5A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 2" />
      <path d="M9.5 7a5 5 0 0 0-5 5v0a5 5 0 0 0 5 5h5a5 5 0 0 0 5-5v0a5 5 0 0 0-5-5" />
      <path d="M5 12a2.5 2.5 0 0 0-2.5 2.5v0A2.5 2.5 0 0 0 5 17h0" />
      <path d="M19 12a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 19 17h0" />
      <path d="M12 7v10" />
    </svg>
  );
}
