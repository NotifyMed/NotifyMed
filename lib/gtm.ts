declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const pageview = (url: string) => {
  window.dataLayer.push({
    event: "pageview",
    page: url,
  });
};
