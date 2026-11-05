import type { Metadata } from "next";
import Link from "next/link";
import { Ja } from "./components/ja";
import { SiteHeader } from "./components/site-header";
import styles from "./components/home-page-view.module.css";
import local from "./components/research-views.module.css";

export const metadata: Metadata = {
  title: "404 ページが見つかりません",
};

/* Set like the other pages, so a broken link still lands on this site. */
export default function NotFound() {
  return (
    <div className={styles.page}>
      <SiteHeader page="other" />
      <main className={styles.main}>
        <section className={local.notFound}>
          <p className={local.kicker}>
            <time>404</time>
          </p>
          <h1 className={styles.statement}>ページが見つかりません</h1>
          <div className={styles.heroNote}>
            <div>
              <p>
                <Ja>お探しのページは、URL が変更されたか、削除された可能性があります。</Ja>
              </p>
              <p className={local.actions}>
                <Link href="/">トップページへ戻る</Link>
                <Link href="/research">研究一覧を見る</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
