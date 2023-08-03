import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout/Layout";
import Script from "next/script";
import { DefaultSeo } from "next-seo";
import useGoogleTagManager from "../hooks/useGoogleTagManager";

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
      <DefaultSeo
        title="Notify Med - Medication Tracker and Reminder"
        description="Never forget to take your medication again!"
        canonical="https://notifymed.com/"
        openGraph={{
          url: "https://notifymed.com/",
          title: "Notify Med - Medication Tracker and Reminder",
          description: "Never miss a medication again!",
          site_name: "Notify Med",
          type: "website",
          locale: "en_US",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "medication, reminder, tracker,",
          },
          {
            name: "author",
            content: "Notify Med",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:locale",
            content: "en_US",
          },
          {
            property: "og:site_name",
            content: "Notify Med",
          },
        ]}
      />
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
