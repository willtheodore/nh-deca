import * as React from "react";

export default function Footer() {
  const date = new Date(Date.now());

  return (
    <div className="w-screen flex flex-col my-10 align-center">
      <p className="text-gray-200 font-light text-center">{`© NH DECA ${date.getFullYear()}`}</p>
      <div className="flex mx-auto mt-5 items-center space-x-3">
        <a
          className="cursor-pointer"
          href="https://www.facebook.com/NHDECA/"
          target="__blank"
        >
          <img className="w-8 h-8" src="/svg/facebook.svg" />
        </a>
        <a
          className="cursor-pointer"
          href="https://twitter.com/NHDECA"
          target="__blank"
        >
          <img className="w-8 h-8" src="/svg/twitter.svg" />
        </a>
        <a
          className="cursor-pointer"
          href="https://www.instagram.com/nh__deca/"
          target="__blank"
        >
          <img className="w-8 h-8" src="/svg/instagram.svg" />
        </a>
      </div>
    </div>
  );
}
