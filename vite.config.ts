import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(config => {
  const sentryConfig: SentryReactRouterBuildOptions = {
    org: "j-mastery",
    project: "travel-agency",
    authToken: import.meta.env.VITE_SENTRY_AUTH_TOKEN, // Now safe
    // You can add other options as needed
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
