import {
  SEND_VERIFICATION_EMAIL,
  sendVerificationEmail as action,
} from "ducks/firebase";
import { buildStatus } from "helpers/buildStatus";
import { type DynamicLinkSettings } from "types/AppConfig";
import { StatusType } from "types/Status";
import type { AppDispatch } from "ducks/store";

interface SendVerificationEmailParams {
  email: string;
  dynamicLinkSettings?: DynamicLinkSettings;
  dispatch: AppDispatch;
  continueUrl?: string;
}

let isSending = false;

export function sendVerificationEmail({
  email,
  dispatch,
  continueUrl,
}: SendVerificationEmailParams) {
  if (isSending) {
    return;
  }

  isSending = true;

  const setStatus = buildStatus(SEND_VERIFICATION_EMAIL, dispatch);
  setStatus(StatusType.loading);

  recoverAccount(email, continueUrl)
    .then(() => {
      dispatch(action());
      setStatus(StatusType.success);
      isSending = false;
    })
    .catch((error) => {
      if ((window as any).Sentry) {
        (window as any).Sentry.captureException(
          error instanceof Error ? error : new Error(String(error)),
        );
      }

      setStatus(StatusType.error, error);
      isSending = false;
    });
}

async function recoverAccount(email: string, continueUrl?: string) {
  const appEnv = (window as any).APP_ENV;
  const endpoint = `${appEnv.BASE_API_URL}/api/v1/users/recover-account`;

  const useContinueUrl = continueUrl || appEnv.DEFAULT_CONTINUE_URL;

  const res = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ email, continueUrl: useContinueUrl }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to send recovery email: ${await res.text()}`);
  }

  return true;
}
