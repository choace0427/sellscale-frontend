import { MsgResponse } from "src";
import { processResponse } from "./utils";
import { API_URL } from "@constants/data";

/**
 * Updates the slack webhook link for an SDR
 * @param userToken
 * @param webhook
 * @returns - MsgResponse
 */
export async function patchSlackWebhook(
  userToken: string,
  webhook: string
): Promise<MsgResponse> {
  const response = await fetch(`${API_URL}/client/webhook`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      webhook: webhook,
    }),
  });
  return await processResponse(response);
}

/**
 * Updates the Microsoft Teams webhook link for an SDR
 * @param userToken
 * @param webhook
 * @returns - MsgResponse
 */
export async function patchMicrosoftTeamsWebhook(
  userToken: string,
  webhook: string
): Promise<MsgResponse> {
  const response = await fetch(`${API_URL}/client/microsoft_teams_webhook`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      webhook: webhook,
    }),
  });
  return await processResponse(response);
}
