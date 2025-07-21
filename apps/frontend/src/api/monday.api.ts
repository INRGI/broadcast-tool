import axios from "axios";
import { GetProductStatusesResponse } from "./monday/response/get-product-statuses.response.dto";
import { GetDomainStatusesResponse } from "./monday/response/get-domain-statuses.response.dto";

const mondayApiUrl = "/api/finances/broadcast-tool/monday";

export const getProductStatuses =
  async (): Promise<GetProductStatusesResponse | null> => {
    try {
      const response = await axios.get(`${mondayApiUrl}/product-statuses`);
      return response.data;
    } catch (error) {
      return null;
    }
  };

export const getDomainStatuses =
  async (): Promise<GetDomainStatusesResponse | null> => {
    try {
      const response = await axios.get(`${mondayApiUrl}/domain-statuses`);
      return response.data;
    } catch (error) {
      return null;
    }
  };
