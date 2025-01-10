import axios from "axios";
import { API_URL, HEADERS } from "../../util/constants";

export const fetchEventList = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return await response.json();
};

export const createEvent = async (eventData) => {
  return axios.post(`${API_URL}/event/create`, eventData, {
    headers: HEADERS,
  });
};
