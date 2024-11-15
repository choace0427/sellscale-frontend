import { logout } from "@auth/core";
import { showNotification } from "@mantine/notifications";
import { MsgResponse } from "src";
import { processResponse } from "./utils";
import { API_URL } from "@constants/data";

export default async function getLiProfile(userToken: string): Promise<MsgResponse> {
  const response = await fetch(
    `${API_URL}/voyager/profile/self`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  return await processResponse(response, 'data');
}


export async function getOtherLiProfile(userToken: string, public_id: string): Promise<MsgResponse> {
  const response = await fetch(
    `${API_URL}/voyager/profile?public_id=${public_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  return await processResponse(response, 'data');
}
