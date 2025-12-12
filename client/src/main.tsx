import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App";
import "./index.css";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

const posthogOptions = {
  api_host: posthogHost,
  person_profiles: "identified_only" as const,
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
};

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, posthogOptions);
}

createRoot(document.getElementById("root")!).render(
  posthogKey && posthogHost ? (
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  ) : (
    <App />
  )
);
