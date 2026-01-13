import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

type DataLayerEvent = {
  event: string;
  pagePath?: string;
  pageTitle?: string;
  [key: string]: unknown;
};

export function usePageTracking() {
  const [location] = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const dataLayer = (window as unknown as { dataLayer: DataLayerEvent[] }).dataLayer || [];
    (window as unknown as { dataLayer: DataLayerEvent[] }).dataLayer = dataLayer;
    
    dataLayer.push({
      event: "virtual_pageview",
      pagePath: location,
      pageTitle: document.title,
    });
  }, [location]);
}
