import { API_URL, HEADERS } from "../../util/constants";
import axios from "axios";
import { getHeadersWithAuth } from "../utils";

export const checkToken = async () => {
  return axios.post(
    `${API_URL}/user/autologin`,
    {},
    { headers: getHeadersWithAuth() }
  );
};

export const apiLogin = async (credentials) => {
  return axios.post(`${API_URL}/user/login`, credentials, { headers: HEADERS });
};

export const apiRegister = async (credentials) => {
  return axios.post(`${API_URL}/user/register`, credentials, {
    headers: HEADERS,
  });
};
