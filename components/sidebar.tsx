import cn from "classnames";
import styles from "./sidebar.module.css";
import * as React from "react";
import Link from "next/link";
import { Section } from "../utils/firestore";
import { getLabels, getSlugs } from "./nav";

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
              slugs={getSlugs(sections[0])}
              labels={getLabels(sections[0])}
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
              slugs={getSlugs(sections[1])}
              labels={getLabels(sections[1])}
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
              slugs={getSlugs(sections[2])}
              labels={getLabels(sections[2])}
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
              slugs={getSlugs(sections[3])}
              labels={getLabels(sections[3])}
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
  slugs: string[];
  labels: string[];
}

function DisclosureLinks({
  open,
  slugs,
  prefix,
  labels,
}: DisclosureLinksProps) {
  if (slugs.length !== labels.length) return null;

  return (
    <ul
      className={cn({
        "transition transform translate-x-0": open,
        "transition transform translate-x-64": !open,
      })}
    >
      {slugs.map((slug, index) => (
        <Link href={`${prefix}/${slug}`}>
          <a className="text-white" key={slug}>
            <li className="mt-1" key={slug}>
              {labels[index]}
            </li>
          </a>
        </Link>
      ))}
    </ul>
  );
}
