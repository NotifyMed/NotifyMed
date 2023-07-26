import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout/Layout";
import { Inter } from "next/font/google";
import useGoogleTagManager from "../hooks/useGoogleTagManager";
import Script from "next/script";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useGoogleTagManager();

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      {process.env.NODE_ENV === "production" && (
        <Script
          src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}`}
        />
      )}
      <Layout>
        <Component {...pageProps} className={inter.className} />
      </Layout>
    </SessionProvider>
  );
}
