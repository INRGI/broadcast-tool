import axios from "axios";
import { GetBroadcastsListResponse } from "./broadcast/response/get-broadcasts-list.response.dto";
import { MakeBroadcastRequest } from "./broadcast/request/make-broadcast.request.dto";
import { ApproveBroadcastRequest } from "./broadcast/request/approve-broadcast.request.dto";
import { GetAllDomainsResponse } from "./broadcast/response/get-all-domains.response.dto.";
import { ApproveBroadcastSheetResponse } from "./broadcast/response/approve-broadcast-sheet.response.dto";
import { GetBroadcastDomainsListResponseDto } from "./broadcast/response/get-broadcast-domains-list.response.dto";
import { GetBroadcastsSendsResponseDto } from "./broadcast/response/get-broadcasts-sends.response.dto";
import { GetBroadcastsSendsRequestDto } from "./broadcast/request/get-broadcasts-sends.request.dto";
import { GetBroadcastsSendsByIdRequestDto } from "./broadcast/request/get-broadcasts-sends-by-id.request.dto";

const broadcastToolApiUrl = "/api/finances/broadcast-tool/broadcast";

export const getBroadcastsList =
  async (): Promise<GetBroadcastsListResponse> => {
    try {
      const response = await axios.get(
        `${broadcastToolApiUrl}/broadcasts-list`
      );
      return response.data;
    } catch (error) {
      return { sheets: [] };
    }
  };

export const getBroadcastDomainsList = async (
  spreadsheetId: string
): Promise<GetBroadcastDomainsListResponseDto> => {
  try {
    const response = await axios.get(
      `${broadcastToolApiUrl}/domains/${spreadsheetId}`
    );
    return response.data;
  } catch (error) {
    return { sheets: [] };
  }
};

export const makeBroadcast = async (
  body: MakeBroadcastRequest
): Promise<GetAllDomainsResponse> => {
  try {
    const response = await axios.post(
      `${broadcastToolApiUrl}/make-broadcast`,
      body
    );
    return response.data;
  } catch (error) {
    return { sheets: [] };
  }
};

export const redoBroadcast = async (
  body: MakeBroadcastRequest
): Promise<GetAllDomainsResponse> => {
  try {
    const response = await axios.post(
      `${broadcastToolApiUrl}/redo-broadcast`,
      body
    );
    return response.data;
  } catch (error) {
    return { sheets: [] };
  }
};

export const approveBroadcast = async (
  body: ApproveBroadcastRequest
): Promise<ApproveBroadcastSheetResponse[]> => {
  try {
    const response = await axios.post(
      `${broadcastToolApiUrl}/approve-broadcast`,
      body
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getBroadcastsSends = async (
  body: GetBroadcastsSendsRequestDto
): Promise<GetBroadcastsSendsResponseDto> => {
  try {
    const response = await axios.post(
      `${broadcastToolApiUrl}/broadcasts-sends`,
      body
    );
    return response.data;
  } catch (error) {
    return { broadcasts: [] };
  }
};

export const getBroadcastSendsById = async (
  body: GetBroadcastsSendsByIdRequestDto
): Promise<GetBroadcastsSendsResponseDto> => {
  try {
    const response = await axios.post(
      `${broadcastToolApiUrl}/broadcast-sends-by-id`,
      body
    );
    return response.data;
  } catch (error) {
    return { broadcasts: [] };
  }
};
