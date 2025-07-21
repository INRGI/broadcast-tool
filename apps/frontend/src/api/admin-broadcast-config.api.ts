import axios from "axios";
import {
  AdminBroadcastConfigResponseDto,
  CreateAdminBroadcastConfigRequestDto,
  UpdateAdminBroadcastConfigRequestDto,
} from "./broadcast-rules";

const adminBroadcastConfigApiUrl =
  "/api/finances/broadcast-tool/admin-broadcast-config";

export const getAdminBroadcastConfigByNiche = async (
  niche: string
): Promise<AdminBroadcastConfigResponseDto | null> => {
  try {
    const response = await axios.get(`${adminBroadcastConfigApiUrl}/${niche}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateAdminBroadcastConfig = async (
  body: UpdateAdminBroadcastConfigRequestDto
): Promise<AdminBroadcastConfigResponseDto | null> => {
  try {
    const response = await axios.put(
      `${adminBroadcastConfigApiUrl}/update`,
      body
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createAdminBroadcastConfig = async (
  body: CreateAdminBroadcastConfigRequestDto
): Promise<AdminBroadcastConfigResponseDto | null> => {
  try {
    const response = await axios.post(
      `${adminBroadcastConfigApiUrl}/create`,
      body
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
