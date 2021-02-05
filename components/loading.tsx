import * as React from "react";

export default function Loading() {
  return (
    <div className="grid place-items-center">
      <h1 className="text-4xl text-white uppercase my-10 font-bold">Loading</h1>
      <img src="/svg/cached.svg" className="animate-spin h-20" />
    </div>
  );
}
