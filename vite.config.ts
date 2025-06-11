import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(config => {
  const sentryAuthToken = process.env.VITE_SENTRY_AUTH_TOKEN;

  if (!sentryAuthToken) {
    console.warn("⚠️ VITE_SENTRY_AUTH_TOKEN is not defined — Sentry source maps will not be uploaded.");
  }

  const sentryConfig: SentryReactRouterBuildOptions = {
    org: "j-mastery",
    project: "travel-agency",
    authToken: sentryAuthToken, // Use process.env here
  };

  return {
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      reactRouter(),
      sentryReactRouter(sentryConfig, config),
    ],
    ssr: {
      noExternal: [/@syncfusion/],
    },
  };
});
