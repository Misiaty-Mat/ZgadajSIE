import axios from "axios";
import { API_URL, HEADERS } from "../../util/constants";
import { getHeadersWithAuth } from "../utils";

export const fetchEventList = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return await response.json();
};

export const fetchPins = async () => {
  return axios.get(`${API_URL}/event/pins`, {
    headers: HEADERS,
  });
};

export const createEvent = async (eventData) => {
  return axios.post(`${API_URL}/event/create`, eventData, {
    headers: getHeadersWithAuth(),
  });
};
