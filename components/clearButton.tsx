import Link from "next/link";
import * as React from "react";

interface ClearButtonProps {
  text: string;
  href: string;
  styles: string;
}

export default function ClearButton({
  text,
  href,
  styles,
  ...props
}: ClearButtonProps) {
  return (
    <Link href={href}>
      <a
        className={
          "bg-blur hover:bg-blue-700 transition duration-300 rounded-lg py-4 px-8 font-bold text-blue-300 uppercase tracking-wider " +
          styles
        }
        {...props}
      >
        {text}
      </a>
    </Link>
  );
}
