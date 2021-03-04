import classNames from "classnames";
import * as React from "react";
import { getImageURL } from "../utils/firestore";
import Footer from "./footer";
import Nav from "./nav";

interface LayoutProps {
  children: React.ReactChild;
  hero?: string | null;
  home?: string;
  title?: string;
  position?: string;
}

export default function Layout({
  hero,
  children,
  title,
  home,
  position,
}: LayoutProps) {
  const [heroURL, setHeroURL] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (hero) {
      getHeroURL();
    }
  }, [hero]);
  const getHeroURL = async () => {
    if (hero) {
      const url = await getImageURL(hero);
      setHeroURL(url);
    }
  };

  return (
    <>
      {heroURL || home ? (
        <div className="w-full absolute top-0 transform translate-y-16 tablet:transform-none tablet:h-screen-3/4 h-screen-1/3">
          <img
            className={
              "object-cover h-full w-full" + (position ? position : "")
            }
            alt="Hero Image - NH DECA"
            src={heroURL ? heroURL : home}
          />
          {title && (
            <h1
              className="font-bold text-2xl tablet:text-6xl absolute bottom-1/2 right-1/2 transform translate-y-1/2 translate-x-1/2 
                         bg-blur text-white uppercase px-6 py-3 tablet:px-10 tablet:py-5 rounded-md text-center"
            >
              {title}
            </h1>
          )}
        </div>
      ) : (
        <div className="w-screen bg-blue-900 px-10 py-10 mt-16 tablet:mt-20">
          <h1 className="text-4xl tablet:text-6xl text-center tablet:text-left text-white uppercase font-semibold">
            {title}
          </h1>
        </div>
      )}
      <Nav />
      <div
        className={classNames({
          "w-screen": true,
          "phone-offset tablet:mt-screen-3/4": hero || home,
        })}
      >
        {children}
      </div>
      <Footer />
    </>
  );
}
