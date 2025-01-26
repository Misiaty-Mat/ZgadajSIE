import axios from "axios";
import { API_URL, HEADERS } from "../../util/constants";
import { getHeadersWithAuth } from "../utils";

export const fetchEventById = async (eventId) => {
  return axios.get(`${API_URL}/event/${eventId}`, {
    headers: getHeadersWithAuth(),
  });
};

export const fetchAllEvents = async (request) => {
  return axios.post(`${API_URL}/event/all`, request, {
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

export const leaveEventPost = async (eventId) => {
  return axios.post(
    `${API_URL}/event/leave/${eventId}`,
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

export const fetchParticipants = async (eventId) => {
  return axios.get(`${API_URL}/event/${eventId}/participants`, {
    headers: HEADERS,
  });
};

export const fetchJoinedEvents = async () => {
  return axios.get(`${API_URL}/user/joined`, {
    headers: getHeadersWithAuth(),
  });
};

export const fetchCreatedEvents = async () => {
  return axios.get(`${API_URL}/user/created`, {
    headers: getHeadersWithAuth(),
  });
};
