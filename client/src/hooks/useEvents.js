import { useCallback, useEffect, useState } from "react";
import { fetchEventList } from "../api/events/events";

const useEvents = () => {
  const [events, setEvents] = useState([]);

  const getEvents = useCallback(async () => {
    const response = await fetchEventList();
    setEvents(response);
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return events;
};

export default useEvents;
