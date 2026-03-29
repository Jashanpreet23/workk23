import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { seedLocalStorage } from "@/data/seedData";

/*
 * every page is wrapped in the shared layout so that
 * individual pages only need to render their own content
 */
export default function App({ Component, pageProps }: AppProps) {
  // seed dummy users into localStorage on first visit
  useEffect(() => {
    seedLocalStorage();
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
