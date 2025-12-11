import { RecaptchaVerifier } from "firebase/auth";
import * as Sentry from "@sentry/browser";

export interface DynamicLinkSettings {
	dynamicLinkDomain?: string; // deprecated
	url: string;
	android: { installApp: boolean; packageName: string };
	iOS: { bundleId: string };
	handleCodeInApp: true;
	linkDomain?: string;
}

export interface AppConfig {
	// required for 'auth with phone'
	phoneNumber?: string;

	// required for 'auth with email'
	email?: string;
	dynamicLinkSettings?: DynamicLinkSettings;

	// required for 'confirm auth with email'
	signInLink?: string;

	recaptchaVerifier: RecaptchaVerifier;

	// accepts both "en" and "en-US" formats
	language: string;
}

declare global {
	interface Window {
		main?: (config: AppConfig) => void;
		getIdToken?: (customToken: string) => Promise<void>;
		APP_ENV: {
			SENTRY_DSN: string;
			FIREBASE_WEB_API_KEY: string;
			FIREBASE_PROJECT_ID: string;
		};
		wasInitted?: boolean;
		Sentry?: typeof Sentry;
	}
}
