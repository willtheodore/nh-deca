import * as React from "react";

interface ErrorMessageProps {
  message: string;
  [key: string]: any;
}

export default function ErrorMessage({ message, ...props }: ErrorMessageProps) {
  return (
    <div className="grid place-items-center" {...props}>
      <h1 className="text-4xl text-red-400 uppercase my-10 font-bold cursor-pointer">
        {message + "\nClick to dismiss."}
      </h1>
    </div>
  );
}
