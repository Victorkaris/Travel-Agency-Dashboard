import * as Sentry from "@sentry/react-router";
 import { startTransition, StrictMode } from "react";
 import { hydrateRoot } from "react-dom/client";
 import { HydratedRouter } from "react-router/dom";

Sentry.init({
 dsn: "https://c10d83c4f4f47ffb5e383cbfb9033f5f@o4509356415254528.ingest.de.sentry.io/4509356427378768",
 
 // Adds request headers and IP for users, for more info visit:
 // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
 sendDefaultPii: true,
 
 integrations: [
   Sentry.reactRouterTracingIntegration(),
   Sentry.replayIntegration(),
   Sentry.feedbackIntegration({
     // Additional SDK configuration goes in here, for example:
     colorScheme: "system",
   }),
 ],
 tracesSampleRate: 1.0, //  Capture 100% of the transactions
 // Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
 tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
 // Capture Replay for 10% of all sessions,
 // plus 100% of sessions with an error
 replaysSessionSampleRate: 0.1,
 replaysOnErrorSampleRate: 1.0,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
