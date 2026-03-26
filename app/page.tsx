import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>近藤悠太 ポートフォリオ</h1>

      <Link href="/research">研究ページへ</Link>
    </main>
  );
}