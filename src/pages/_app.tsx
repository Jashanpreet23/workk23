import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { seedBookingData } from "@/data/bookingData";
import { seedLocalStorage } from "@/data/seedData";

/*
 * every page is wrapped in the shared layout so that
 * individual pages only need to render their own content
 */
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    seedLocalStorage();
    seedBookingData();
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
