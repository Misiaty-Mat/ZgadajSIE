import {API_URL} from "../../util/constants"

export const fetchEventList = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return await response.json();
};
