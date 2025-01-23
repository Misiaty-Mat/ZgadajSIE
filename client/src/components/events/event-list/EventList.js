import { useEffect, useState } from "react";
import Event from "../event/Event";
import { useStores } from "../../../contexts/event-context";
import { DISTANCE_STEPS } from "../../../util/constants";
import { observer } from "mobx-react-lite";

const EventList = observer(() => {
  const [searchedTitle, setSearchedTitle] = useState("");
  const [range, setRange] = useState(DISTANCE_STEPS.length - 1);
  const [sortBy, setSortBy] = useState("distance");

  const { eventStore } = useStores();

  useEffect(() => {
    eventStore.filterEvents(
      {
        title: searchedTitle,
        range: DISTANCE_STEPS[range],
      },
      sortBy
    );
  }, [eventStore, range, searchedTitle, sortBy]);

  return (
    <div>
      <label htmlFor="title">Szukaj</label>
      <input
        name="title"
        value={searchedTitle}
        onChange={(e) => setSearchedTitle(e.target.value)}
      />

      <label htmlFor="filters">Filtry</label>
      <select name="filters">
        <option>-</option>
        <option>idk</option>
        <option>idk2</option>
      </select>

      <label htmlFor="range">Zasięg</label>
      <input
        type="range"
        name="range"
        min="0"
        max={DISTANCE_STEPS.length - 1}
        value={range}
        onInput={(e) => setRange(e.target.value)}
      />
      {(DISTANCE_STEPS[range] || "∞") + " km"}

      <label htmlFor="sortBy">Sortuj</label>
      <select name="sortBy" onChange={(e) => setSortBy(e.target.value)}>
        <option value="distance" selected>
          Dystans
        </option>
        <option value="title">Alfabetycznie</option>
        <option value="beginDateSoon">Od najwcześniejszych</option>
        <option value="beginDateLate">Od najpóźniejszych</option>
      </select>
      {eventStore.paginatedEvents.map((event) => (
        <Event key={event.id} event={event} />
      ))}
      <button
        disabled={eventStore.isLastPage}
        onClick={eventStore.incrementPage}
      >
        ...
      </button>
    </div>
  );
});

export default EventList;
