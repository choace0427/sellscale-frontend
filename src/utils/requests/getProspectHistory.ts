import { API_URL } from "@constants/data";
import { MsgResponse, Prospect } from "src";
import { processResponse } from "./utils";
import _ from "lodash";

export async function getProspectLiHistory(userToken: string, prospect_id: number): Promise<MsgResponse> {

  const response = await fetch(
    `${API_URL}/prospect/${prospect_id}/li_history`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  return await processResponse(response, 'data');

}

