import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "j-mastery",
  project: "travel-agency",
  // An auth token is required for uploading source maps.
  authToken: "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"
  // ...
};


export default defineConfig(config => {
  return {
  plugins: [tailwindcss(),  tsconfigPaths(), reactRouter(),sentryReactRouter(sentryConfig, config)],
  sentryConfig,
   ssr: {
    noExternal: [/@syncfusion/] 
  },
  };
});