import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { pl } from "date-fns/locale";
import { Tooltip } from "react-tooltip";
import Event from "../event/Event";
import { useStores } from "../../../contexts/event-context";
import { DISTANCE_STEPS } from "../../../util/constants";
import AddEventButton from "../add-event/button/AddEventButton";

import "react-datepicker/dist/react-datepicker.css";
import useGeolocation from "../../../hooks/useGeolocation";

const EventList = observer(() => {
  const [searchedTitle, setSearchedTitle] = useState("");
  const [range, setRange] = useState(DISTANCE_STEPS.length - 1);
  const [sortBy, setSortBy] = useState("distance");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateRangeStart, dateRangeEnd] = dateRange;

  const { isDefault } = useGeolocation();
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
  }, [
    dateRangeEnd,
    dateRangeStart,
    eventStore,
    eventStore.events,
    range,
    searchedTitle,
    sortBy,
  ]);

  return (
    <>
      <div className="main-page-sectionLeft-inputs">
        {/* Szuka i zasięg */}
        <div className="main-page-sectionLeft-inputDiv">
          <div className="main-page-sectionLeft-inputItem">
            <label
              className="main-page-sectionLeft-inputLabels"
              htmlFor="title"
            >
              Szukaj
            </label>
            <input
              className="main-page-sectionLeft-inputSearch labelWidth"
              name="title"
              value={searchedTitle}
              onChange={(e) => setSearchedTitle(e.target.value)}
            />
          </div>
          <div className="main-page-sectionLeft-inputItem">
            <label
              className="main-page-sectionLeft-inputLabels"
              htmlFor="range"
            >
              Zasięg
            </label>
            <input
              className="main-page-sectionLeft-inputRange labelWidth"
              disabled={isDefault}
              type="range"
              name="range"
              min="0"
              max={DISTANCE_STEPS.length - 1}
              value={range}
              onInput={(e) => setRange(e.target.value)}
              data-tooltip-id="range-tooltip"
              data-tooltip-content="Zezwól na ustalenie twojego położenia by używać tej funkcji"
            />
            {isDefault && <Tooltip id="range-tooltip" />}
            <div className="main-page-sectionLeft-inputRange-KM">
              {" "}
              {(DISTANCE_STEPS[range] || "∞") + " km"}
            </div>
          </div>
        </div>
        {/* Sortuj i dystans */}
        <div className="main-page-sectionLeft-inputDiv">
          <div className="main-page-sectionLeft-inputItem">
            <label className="main-page-sectionLeft-inputLabels" htmlFor="days">
              Dzień
            </label>
            <DatePicker
              name="days"
              className="main-page-sectionLeft-inputFilters labelWidth"
              selectsRange={true}
              startDate={dateRangeStart}
              endDate={dateRangeEnd}
              onChange={(update) => {
                setDateRange(update);
              }}
              locale={pl}
            />
          </div>
          <div className="main-page-sectionLeft-inputItem select-wrapper">
            <label
              className="main-page-sectionLeft-inputLabels"
              htmlFor="sortBy"
            >
              Sortuj
            </label>
            <select
              className="main-page-sectionLeft-inputSort  labelWidth"
              name="sortBy"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="distance">Dystans</option>
              <option value="title">Alfabetycznie</option>
              <option value="beginDateSoon">Od najwcześniejszych</option>
              <option value="beginDateLate">Od najpóźniejszych</option>
            </select>
          </div>
        </div>
        {/* utwórz wydarzenie */}
        <div className="main-page-sectionLeft-inputDiv">
          <AddEventButton />
        </div>
      </div>
      {eventStore.paginatedEvents.map((event) => (
        <Event key={event.eventId} event={event} />
      ))}
      {/* Wczytanie kolejnych X wydarzeń */}
      {!eventStore.isLastPage && (
        <button onClick={eventStore.incrementPage}>...</button>
      )}
    </>
  );
});

export default EventList;
