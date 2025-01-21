import { useEffect, useState } from "react";
import { fetchEventList } from "../../../api/events/events";
import useGeolocation from "../../../hooks/useGeolocation";
import Event from "../event/Event";
import { handleError } from "../../../api/utils";
import { EVENT_LIST_MOCK } from "../../../util/mocks";

const EventList = () => {
  const [page, setPage] = useState(0);
  const [range, setRange] = useState(10);
  const [events, setEvents] = useState([]);

  const { lat, lng } = useGeolocation();

  const fetchEvents = (request) => {
    fetchEventList(request)
      .then((response) => {
        setEvents(response.data.events || EVENT_LIST_MOCK);
      })
      .catch((error) => handleError(error));
  };

  useEffect(() => {
    const request = {
      latitude: lat,
      longitude: lng,
      tagIds: [],
      sortingOption: "",
      range,
      page,
    };
    fetchEvents(request);
  }, [lat, lng, setEvents]);

  return (
    <div>
      <label for="title">Szukaj</label>
      <input name="title" />

      <label for="filters">Filtry</label>
      <select name="filters">
        <option>-</option>
        <option>idk</option>
        <option>idk2</option>
      </select>

      <label for="range">Zasięg</label>
      <input
        type="range"
        name="range"
        min="1"
        max="500"
        value={range}
        onChange={(e) => setRange(e.target.value)}
      />
      {range + "km"}

      <label for="sortBy">Sortuj</label>
      <select name="sortBy">
        <option>Dystans</option>
        <option>Tytuł</option>
        <option>Czas startu</option>
      </select>
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
