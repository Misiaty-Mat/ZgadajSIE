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

export const getUserProfile = async () => {
  return axios.get(`${API_URL}/user/profile`, {
    headers: getHeadersWithAuth(),
  });
};

export const updateUserProfile = async (request) => {
  return axios.put(`${API_URL}/user/profile/update`, request, {
    headers: getHeadersWithAuth(),
  });
};
