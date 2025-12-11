import React from "react";
import { Provider } from "react-redux";
import { I18nProvider } from "@lingui/react";
import * as Sentry from "@sentry/browser";

import "./index.css";
import { initializeFirebase, auth } from "config/firebase";
import { App } from "components/App";
import { store } from "ducks/store";
import { determineLanguage } from "helpers/determineLanguage";
import { type AppConfig } from "types/AppConfig";
import { createRoot, type Root } from "react-dom/client";
import { i18n } from "config/i18n";
import { signInWithCustomToken } from "firebase/auth";

window.Sentry = Sentry;

if (window.APP_ENV) {
  Sentry.init({
    dsn: window.APP_ENV.SENTRY_DSN,
  });
}

let root: Root | null = null;

window.getIdToken = async (customToken: string) => {
  initializeFirebase({
    apiKey: window.APP_ENV.FIREBASE_WEB_API_KEY,
    projectId: window.APP_ENV.FIREBASE_PROJECT_ID,
  });

  try {
    const user = await signInWithCustomToken(auth(), customToken);
    const idToken = await user.user?.getIdToken();

    console.log("resolved token", idToken);

    window.postMessage(
      JSON.stringify({ type: "idToken", idToken }),
      window.location.origin,
    );
  } catch (err) {
    console.error("failed to resolve token", err);
    window.postMessage(
      JSON.stringify({ type: "error", error: (err as Error).message }),
      window.location.origin,
    );
  }
};

window.main = function main(config: AppConfig) {
  window.wasInitted = true;

  const appEnv = window.APP_ENV;
  const language = determineLanguage(config.language || "en");

  initializeFirebase({
    apiKey: appEnv.FIREBASE_WEB_API_KEY,
    projectId: appEnv.FIREBASE_PROJECT_ID,
  });

  auth().languageCode = language;

  i18n.activate(language);

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found in the DOM.");
  }

  if (!root) {
    root = createRoot(rootElement);
  }

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <App config={{ ...config }} />
        </I18nProvider>
      </Provider>
    </React.StrictMode>,
  );
};
