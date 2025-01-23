import { useEffect, useState } from "react";
import useGeolocation from "../../../hooks/useGeolocation";
import Event from "../event/Event";
import { useStores } from "../../../contexts/event-context";
import { useFormik } from "formik";
import { DISTANCE_STEPS } from "../../../util/constants";
import { observer } from "mobx-react-lite";
import AddEventButton from "../add-event/button/AddEventButton";

const EventList = observer(() => {
  const [page, setPage] = useState(0);
  const [searchedTitle, setSearchedTitle] = useState("");
  const [range, setRange] = useState(DISTANCE_STEPS.length - 1);
  const [sortBy, setSortBy] = useState("distance");

  const { eventStore } = useStores();

  useEffect(() => {
    eventStore.fiterEvents(
      {
        title: searchedTitle,
        range: DISTANCE_STEPS[range],
      },
      sortBy
    );
  }, [eventStore, range, searchedTitle, sortBy]);

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
              type="range"
              name="range"
              min="0"
              max={DISTANCE_STEPS.length - 1}
              value={range}
              onInput={(e) => setRange(e.target.value)}
            />
            <div className="main-page-sectionLeft-inputRange-KM">
              {" "}
              {(DISTANCE_STEPS[range] || "∞") + " km"}
            </div>
          </div>
        </div>
        {/* Sortuj i dystans */}
        <div className="main-page-sectionLeft-inputDiv">
          <div className="main-page-sectionLeft-inputItem">
            <label
              className="main-page-sectionLeft-inputLabels"
              htmlFor="filters"
            >
              Filtry
            </label>
            <select
              className="main-page-sectionLeft-inputFilters labelWidth"
              name="filters"
            >
              <option>-</option>
              <option>idk</option>
              <option>idk2</option>
            </select>
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
            >
              <option value="distance" selected>
                Dystans
              </option>
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
      {eventStore.filteredEvents.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </>
  );
});

export default EventList;
