import classNames from "classnames";
import * as React from "react";
import { Section } from "../utils/firestore";
import Nav from "./nav";

interface LayoutProps {
  children: React.ReactChild;
  hero?: string;
}

export default function Layout({ hero, children }: LayoutProps) {
  return (
    <>
      {hero ? (
        <div className="w-full absolute top-0 transform translate-y-16 tablet:transform-none tablet:h-screen-3/4 h-screen-1/3">
          <img
            className="object-cover h-full w-full"
            alt="Hero Image - NH DECA"
            src={hero}
          />
        </div>
      ) : null}
      <Nav />
      <div
        className={classNames({
          "w-screen": true,
          "phone-offset tablet:mt-screen-3/4": hero,
        })}
      >
        {children}
      </div>
    </>
  );
}
