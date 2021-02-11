import * as React from "react";

interface PhotoSubmitModalProps {}
export default function PhotoSubmitModal({}: PhotoSubmitModalProps) {
  return (
    <div className="p-5 flex flex-col items-start tablet:w-screen-1/2 w-screen-2/3">
      <h1 className="text-xl tablet:text-2xl uppercase text-white">
        Photo Submission
      </h1>
    </div>
  );
}
