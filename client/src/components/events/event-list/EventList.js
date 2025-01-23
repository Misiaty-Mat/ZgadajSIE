import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { pl } from "date-fns/locale";
import Event from "../event/Event";
import { useStores } from "../../../contexts/event-context";
import { DISTANCE_STEPS } from "../../../util/constants";

import "react-datepicker/dist/react-datepicker.css";

const EventList = observer(() => {
  const [searchedTitle, setSearchedTitle] = useState("");
  const [range, setRange] = useState(DISTANCE_STEPS.length - 1);
  const [sortBy, setSortBy] = useState("distance");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateRangeStart, dateRangeEnd] = dateRange;

  const { eventStore } = useStores();

  useEffect(() => {
    eventStore.filterEvents(
      {
        title: searchedTitle,
        range: DISTANCE_STEPS[range],
        dateRangeStart,
        dateRangeEnd,
      },
      sortBy
    );
  }, [dateRangeEnd, dateRangeStart, eventStore, range, searchedTitle, sortBy]);

  return (
    <div>
      <div>
        <label htmlFor="title">Szukaj</label>
        <input
          name="title"
          value={searchedTitle}
          onChange={(e) => setSearchedTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="days">Dzień</label>
        <DatePicker
          name="days"
          selectsRange={true}
          startDate={dateRangeStart}
          endDate={dateRangeEnd}
          onChange={(update) => {
            setDateRange(update);
          }}
          locale={pl}
        />
      </div>

      <div>
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
      </div>

      <div>
        <label htmlFor="sortBy">Sortuj</label>
        <select name="sortBy" onChange={(e) => setSortBy(e.target.value)}>
          <option value="distance" selected>
            Dystans
          </option>
          <option value="title">Alfabetycznie</option>
          <option value="beginDateSoon">Od najwcześniejszych</option>
          <option value="beginDateLate">Od najpóźniejszych</option>
        </select>
      </div>
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
