import { HEADERS, TOKEN_NAME } from "../util/constants";

const getToken = () => localStorage.getItem(TOKEN_NAME);

export const getHeadersWithAuth = () => {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}`, ...HEADERS };
  }

  return HEADERS;
};
