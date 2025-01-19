import { toast } from "react-toastify";
import { HEADERS, TOKEN_NAME } from "../util/constants";

const getToken = () => localStorage.getItem(TOKEN_NAME);

export const getHeadersWithAuth = () => {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}`, ...HEADERS };
  }

  return HEADERS;
};

export const handleError = (error) => {
  if (error.status === 400) {
    Object.values(error.response.data.errors)
      .flatMap((arr) => arr)
      .forEach((errorMsg) => {
        toast.error(errorMsg);
      });
  } else if (error.status === 401) {
    toast.error("Zaloguj się by wykonać tą akcję!");
  } else {
    toast.error("Coś poszło nie tak...");
  }
};
