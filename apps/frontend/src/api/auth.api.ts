import axios from "axios";

const authApiUrl = "/api/broadcast-tool/auth";

export const googleAuth = async (
  id_token: string
): Promise<{
  email: string;
  name: string;
  lastLogin: string;
}> => {
  try {
    const response: {
      email: string;
      name: string;
      lastLogin: string;
    } = await axios.post(`${authApiUrl}/google`, {
      id_token,
    });

    return response;
  } catch  {
    return {
      email: "",
      name: "",
      lastLogin: "",
    };
  }
};

export const checkIfAdmin = async (id_token: string): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${authApiUrl}/admin`, {
      id_token,
    });
    return response.data;
  } catch  {
    return { token: '' };
  }
};
