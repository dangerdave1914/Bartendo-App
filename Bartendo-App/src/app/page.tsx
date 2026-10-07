import Link from "next/link";
import { demoThemes } from "@/themes/demo";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <h1>Bartendo</h1>
      <p>Early build. The full clickable prototype lives in /prototype/index.html.</p>
      <h2>Demo venues</h2>
      <ul>
        {Object.entries(demoThemes).map(([slug, v]) => (
          <li key={slug}>
            <Link href={`/v/${slug}`}>{v.name}</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/bar">Bartender queue</Link>
      </p>
    </main>
  );
}
