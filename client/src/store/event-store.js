import { makeAutoObservable } from "mobx";
import moment from "moment";
import { EVENTS_PER_PAGE } from "../util/constants";
import { fetchAllEvents, fetchEventById } from "../api/events/events";
import { handleError } from "../api/utils";

class EventStore {
  events = [];
  filteredEvents = [];
  selectedEvent = undefined;
  targetEvent = undefined;
  page = 1;
  isLastPage = false;
  eventModalOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchEvents(userPosition) {
    this.page = 1;
    fetchAllEvents(userPosition)
      .then((response) => {
        this.events = response.data.event;
        this.filteredEvents = this.events;
      })
      .catch((error) => handleError(error));
  }

  filterEvents(filters, sortBy) {
    this.page = 1; // reset paginacji strony jaką obecnie widzi użytkownik
    this.filteredEvents = this.events
      .filter(
        (event) =>
          !filters.title ||
          event.title.toLowerCase().includes(filters.title.toLowerCase()) // filtrowanie po tytule
      )
      .filter((event) => !filters.range || event.distance <= filters.range) // filtrowanie po dystansie od uzytkownika
      .filter(
        (event) =>
          !filters.dateRangeStart ||
          moment(event.startDate).isAfter(moment(filters.dateRangeStart)) // filtrowanie po czasie rozpoczęcia (początek zakresu)
      )
      .filter(
        (event) =>
          !filters.dateRangeEnd ||
          moment(event.startDate).isBefore(
            moment(filters.dateRangeEnd).add(1, "d") // filtrowanie po czasie rozpoczęcia (koniec zakresu)
          )
      )
      .filter(
        (event) =>
          filters.tagNames.length === 0 ||
          event.tagNames.some(
            (eventTag) => filters.tagNames.includes(eventTag) // filtrowanie po znacznikach
          )
      );

    // logika sortowania
    switch (sortBy) {
      case "distance":
        this.filteredEvents.sort((a, b) => a.distance - b.distance);
        break;
      case "title":
        this.filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "beginDateSoon":
        this.filteredEvents.sort((a, b) =>
          moment(a.startDate).diff(moment(b.startDate))
        );
        break;
      case "beginDateLate":
        this.filteredEvents.sort((a, b) =>
          moment(b.startDate).diff(moment(a.startDate))
        );
        break;
      default:
        break;
    }
  }

  setSelectedEvent = (eventId) => {
    fetchEventById(eventId)
      .then((response) => {
        this.selectedEvent = response.data.event;
        this.toggleEventModal();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  setTargetEvent = (eventId) => {
    fetchEventById(eventId)
      .then((response) => {
        this.targetEvent = response.data.event;
      })
      .catch((error) => {
        handleError(error);
      });
  };

  incrementPage = () => {
    this.page = this.page + 1;
  };

  get paginatedEvents() {
    if (this.filteredEvents.length <= EVENTS_PER_PAGE * this.page) {
      this.isLastPage = true;
      return this.filteredEvents;
    } else {
      this.isLastPage = false;
      return this.filteredEvents.slice(0, EVENTS_PER_PAGE * this.page);
    }
  }

  toggleEventModal = () => {
    this.eventModalOpened = !this.eventModalOpened;
  };
}

const eventStore = new EventStore();
export default eventStore;
