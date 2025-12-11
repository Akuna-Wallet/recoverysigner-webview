// Create an `env-config.js` file in this directory with this content

window.APP_ENV = {
	FIREBASE_WEB_API_KEY: "your firebase web api key",
	FIREBASE_PROJECT_ID: "your firebase project id",
	LOGO_URL: "https://example.com/logo.svg",
	BASE_API_URL: "https://api.example.com",
	// Required because old app versions don't supply `continueUrl`
	DEFAULT_CONTINUE_URL: "https://akuna-wallet-dev-2.web.app",
};
