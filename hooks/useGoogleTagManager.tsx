import { useEffect } from "react";
import { useRouter } from "next/router";
import * as gtm from "../lib/gtm";

const useGoogleTagManager = () => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const handleRouteChange = (url: string) => {
      gtm.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};

export default useGoogleTagManager;
