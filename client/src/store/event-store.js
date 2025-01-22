import { makeAutoObservable, reaction } from "mobx";
import { fetchPins } from "../api/events/events";
import { toast } from "react-toastify";
import { EVENT_LIST_MOCK } from "../util/mocks";
import moment from "moment";

class EventStore {
  eventPins = [];
  events = [];
  filteredEvents = [];
  userLocation = null;

  constructor() {
    makeAutoObservable(this);
    this.getUserLocation();
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = position.coords;
      },
      (error) => {
        console.error("Error fetching location:", error);
        toast.error("Wystąpił błąd przy próbie pobrania lokalizacji.");
      }
    );
  }

  assignDistancesToEvents() {
    this.events = this.events.map((event) => {
      const distance = this.getDistance(this.userLocation, event);
      return { ...event, distance };
    });
    console.log(this.events);
    this.filteredEvents = this.events; // Update filtered events as well
  }

  fetchEvents() {
    this.events = EVENT_LIST_MOCK;
    // fetchEventList()
    //   .then((response) => {
    //     this.events = response.data.events;
    //   })
    //   .catch((error) => handleError(error));

    this.assignDistancesToEvents();
  }

  fiterEvents(filters, sortBy) {
    this.filteredEvents = this.events
      .filter(
        (event) =>
          !filters.title ||
          event.title.toLowerCase().includes(filters.title.toLowerCase())
      )
      .filter(
        (event) => !filters.range || event.distance <= filters.range * 1000
      );

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
  }

  updateMapPins() {
    fetchPins()
      .then((response) => {
        if (this.eventPins.length !== response.data.pins.length) {
          this.eventPins = response.data.pins;
        }
      })
      .catch((error) => {
        toast.error("Wystąpił błąd: " + error.message);
      });
  }

  rad(x) {
    return (x * Math.PI) / 180;
  }

  getDistance(p1, p2) {
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = this.rad(p2.latitude - p1.latitude);
    const dLong = this.rad(p2.longitude - p1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.latitude)) *
        Math.cos(this.rad(p2.latitude)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }
}

const eventStore = new EventStore();
export default eventStore;
