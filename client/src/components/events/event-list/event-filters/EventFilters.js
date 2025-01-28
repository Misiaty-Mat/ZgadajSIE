import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import DatePicker from "react-datepicker";
import { pl } from "date-fns/locale";
import { DISTANCE_STEPS } from "../../../../util/constants";
import useGeolocation from "../../../../hooks/useGeolocation";
import { useStores } from "../../../../contexts/stores-context";
import TagList from "../tags/TagList";

const EventFilters = () => {
  const [searchedTitle, setSearchedTitle] = useState("");
  const [range, setRange] = useState(DISTANCE_STEPS.length - 1);
  const [sortBy, setSortBy] = useState("distance");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateRangeStart, dateRangeEnd] = dateRange;
  const [tagNames, setTagNames] = useState([]);

  const { isDefault } = useGeolocation();
  const { eventStore } = useStores();

  useEffect(() => {
    eventStore.filterEvents(
      {
        title: searchedTitle,
        range: DISTANCE_STEPS[range],
        dateRangeStart,
        dateRangeEnd,
        tagNames,
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
    tagNames,
    sortBy,
  ]);

  return (
    <div>
      {/* Szuka i zasięg */}
      <div className="main-page-sectionLeft-inputDiv">
        <div className="main-page-sectionLeft-inputItem">
          <label className="main-page-sectionLeft-inputLabels" htmlFor="title">
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
          <label className="main-page-sectionLeft-inputLabels" htmlFor="range">
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
            className="main-page-sectionLeft-inputFilters main-page-sectionLeft-inputSearch labelWidth"
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
          <label className="main-page-sectionLeft-inputLabels" htmlFor="sortBy">
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

      <TagList tagSetter={setTagNames} />
    </div>
  );
};

export default EventFilters;
