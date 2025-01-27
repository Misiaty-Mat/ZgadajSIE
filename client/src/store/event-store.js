import { makeAutoObservable } from "mobx";
import moment from "moment";
import { EVENTS_PER_PAGE } from "../util/constants";
import { fetchAllEvents } from "../api/events/events";
import { handleError } from "../api/utils";

class EventStore {
  events = [];
  filteredEvents = [];
  selectedEvent = undefined;
  page = 1;
  isLastPage = false;
  eventModalOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchEvents(userPosition) {
    this.page = 1;
    this.isLastPage = false;
    fetchAllEvents(userPosition)
      .then((response) => {
        this.events = response.data.event;
        this.filteredEvents = this.events;
      })
      .catch((error) => handleError(error));
  }

  filterEvents(filters, sortBy) {
    this.page = 1;
    this.isLastPage = false;
    this.filteredEvents = this.events
      .filter(
        (event) =>
          !filters.title ||
          event.title.toLowerCase().includes(filters.title.toLowerCase())
      )
      .filter((event) => !filters.range || event.distance <= filters.range)
      .filter(
        (event) =>
          !filters.dateRangeStart ||
          moment(event.startDate).isAfter(moment(filters.dateRangeStart))
      )
      .filter(
        (event) =>
          !filters.dateRangeEnd ||
          moment(event.startDate).isBefore(
            moment(filters.dateRangeEnd).add(1, "d")
          )
      )
      .filter((event) => {
        return (
          filters.tagNames.length === 0 ||
          event.tagNames.some((eventTag) => filters.tagNames.includes(eventTag))
        );
      });

    if (sortBy === "distance") {
      this.filteredEvents.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === "title") {
      this.filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "beginDateSoon") {
      this.filteredEvents.sort((a, b) =>
        moment(a.startDate).diff(moment(b.startDate))
      );
    } else if (sortBy === "beginDateLate") {
      this.filteredEvents.sort((a, b) =>
        moment(b.startDate).diff(moment(a.startDate))
      );
    }

    if (this.filteredEvents.length <= EVENTS_PER_PAGE) {
      this.isLastPage = true;
    }
  }

  setSelectedEvent = (event) => {
    this.selectedEvent = event;
    this.toggleEventModal();
  };

  incrementPage = () => {
    this.page = this.page + 1;

    const filteredEventAmount = this.filteredEvents.length;
    const loadEventCount = EVENTS_PER_PAGE * this.page;
    if (loadEventCount > filteredEventAmount) {
      this.isLastPage = true;
    }
  };

  get paginatedEvents() {
    if (this.isLastPage) {
      return this.filteredEvents;
    } else {
      return this.filteredEvents.slice(0, EVENTS_PER_PAGE * this.page);
    }
  }

  toggleEventModal = () => {
    this.eventModalOpened = !this.eventModalOpened;
  };
}

const eventStore = new EventStore();
export default eventStore;
