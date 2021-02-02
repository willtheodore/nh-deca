import cn from "classnames";
import styles from "./sidebar.module.css";
import * as React from "react";
import Link from "next/link";
import { Page, Section } from "../utils/firestore";
import { getPages } from "./nav";

interface SidebarProps {
  active: boolean;
  sections: Section[];
}

export default function Sidebar({ active, sections }: SidebarProps) {
  return (
    <div
      className={cn({
        [styles.constant]: true,
        [styles.inactive]: active === false,
        [styles.active]: active === true,
      })}
    >
      <div className={styles.spacer} />
      <DisclosureGroup
        header="About"
        render={(open) =>
          open ? (
            <DisclosureLinks
              open={open}
              prefix="about"
              pages={getPages(sections[0])}
            />
          ) : (
            <></>
          )
        }
      />

      <DisclosureGroup
        header="Members"
        render={(open) =>
          open ? (
            <DisclosureLinks
              open={open}
              prefix="members"
              pages={getPages(sections[1])}
            />
          ) : (
            <></>
          )
        }
      />

      <DisclosureGroup
        header="Conferences"
        render={(open) =>
          open ? (
            <DisclosureLinks
              open={open}
              prefix="conferences"
              pages={getPages(sections[2])}
            />
          ) : (
            <></>
          )
        }
      />

      <DisclosureGroup
        header="News"
        render={(open) =>
          open ? (
            <DisclosureLinks
              open={open}
              prefix="news"
              pages={getPages(sections[3])}
            />
          ) : (
            <></>
          )
        }
      />
    </div>
  );
}

interface DisclosureGroupProps {
  header: string;
  render: (open: boolean) => JSX.Element;
}

function DisclosureGroup({ header, render }: DisclosureGroupProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col cursor-default mt-6">
      <div className={styles.disclosureHeader} onClick={() => setOpen(!open)}>
        <h1>{header}</h1>
        <img
          className={cn({
            "transform transition": true,
            "-rotate-90": !open,
          })}
          alt="Disclosure group indicator"
          src="/svg/disclosure.svg"
        />
      </div>
      {render(open)}
    </div>
  );
}

interface DisclosureLinksProps {
  open: boolean;
  prefix: string;
  pages: Page[];
}

function DisclosureLinks({ open, prefix, pages }: DisclosureLinksProps) {
  return (
    <ul
      className={cn({
        "transition transform translate-x-0": open,
        "transition transform translate-x-64": !open,
      })}
    >
      {pages.map((page) => (
        <Link href={`${prefix}/${page.slug}`}>
          <a className="text-white" key={page.slug}>
            <li className="mt-1" key={page.slug}>
              {page.label}
            </li>
          </a>
        </Link>
      ))}
    </ul>
  );
}
