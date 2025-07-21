import axios from "axios";
import { BroadcastRulesPaginatedResponse } from "./broadcast-rules/response/broadcast-rules-paginated.response.dto";
import { BroadcastRulesResponse } from "./broadcast-rules/response/broadcast-rules.response.dto";
import { UpdateBroadcastRulesRequestDto } from "./broadcast-rules/request/update-broadcast-rules.request.dto";
import { CreateBroadcastRulesRequest } from "./broadcast-rules/request/create-broadcast-rules.request.dto";

const broadcastRulesApiUrl = "/api/finances/broadcast-tool/broadcast-rules";

export const getPaginatedBroadcastRules =
  async (): Promise<BroadcastRulesPaginatedResponse> => {
    try {
      const response = await axios.get(`${broadcastRulesApiUrl}/paginated`);
      return response.data;
    } catch (error) {
      return { items: [] };
    }
  };

export const getBroadcastRulesById = async (
  id: string
): Promise<BroadcastRulesResponse | null> => {
  try {
    const response = await axios.get(`${broadcastRulesApiUrl}/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateBroadcastRules = async (
  body: UpdateBroadcastRulesRequestDto
): Promise<BroadcastRulesResponse | null> => {
  try {
    const response = await axios.put(`${broadcastRulesApiUrl}/update`, body);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteBroadcastRules = async (
  id: string
): Promise<void | null> => {
  try {
    await axios.delete(`${broadcastRulesApiUrl}/${id}`);
  } catch (error) {
    return null;
  }
};

export const createBroadcastRules = async (
  body: CreateBroadcastRulesRequest
): Promise<BroadcastRulesResponse | null> => {
  try {
    const response = await axios.post(`${broadcastRulesApiUrl}/create`, body);
    return response.data;
  } catch (error) {
    return null;
  }
};
