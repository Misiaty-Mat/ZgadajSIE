import axios from "axios";

import { API_URL, HEADERS } from "../../util/constants";

export const fetchAllTags = async () => {
  return axios.get(`${API_URL}/tag/all`, {
    headers: HEADERS,
  });
};
