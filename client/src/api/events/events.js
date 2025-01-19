import axios from "axios";
import { API_URL, HEADERS } from "../../util/constants";
import { getHeadersWithAuth } from "../utils";

export const fetchEventById = async (eventId) => {
  return axios.get(`${API_URL}/event/${eventId}`, {
    headers: getHeadersWithAuth(),
  });
};

export const fetchPins = async () => {
  return axios.get(`${API_URL}/event/pins`, {
    headers: HEADERS,
  });
};

export const joinEventPost = async (eventId) => {
  return axios.post(
    `${API_URL}/event/join/${eventId}`,
    {},
    {
      headers: getHeadersWithAuth(),
    }
  );
};

export const createEvent = async (eventData) => {
  return axios.post(`${API_URL}/event/create`, eventData, {
    headers: getHeadersWithAuth(),
  });
};
