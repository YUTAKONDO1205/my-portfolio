import Link from "next/link";
import { profile } from "../portfolio-data";
import styles from "./home-page-view.module.css";

/* The one header every page uses: the name, then the home page's sections.
   On the home page the links scroll to those sections; elsewhere they lead
   back to them, except 研究, which leads to the research index. */

const SECTIONS = [
  { id: "works", label: "制作物" },
  { id: "research", label: "研究" },
  { id: "talks", label: "学会発表" },
  { id: "records", label: "受賞と記事" },
  { id: "contact", label: "プロフィールと連絡先" },
] as const;

type SiteHeaderProps = {
  /** which page is showing: the home page, the research index, or another page */
  page: "home" | "research-index" | "other";
};

export function SiteHeader({ page }: SiteHeaderProps) {
  const onHome = page === "home";

  return (
    <header className={styles.header}>
      {onHome ? (
        <a className={styles.brand} href="#top">
          {profile.nameJa}
        </a>
      ) : (
        <Link className={styles.brand} href="/">
          {profile.nameJa}
        </Link>
      )}
      <nav className={styles.nav} aria-label="主要セクション">
        {SECTIONS.map((section) => {
          if (onHome) {
            return (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            );
          }
          if (section.id === "research") {
            return (
              <Link
                key={section.id}
                href="/research"
                aria-current={page === "research-index" ? "page" : undefined}
              >
                {section.label}
              </Link>
            );
          }
          return (
            <Link key={section.id} href={`/#${section.id}`}>
              {section.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
