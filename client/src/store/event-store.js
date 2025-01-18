import { makeAutoObservable } from "mobx";
import { fetchPins } from "../api/events/events";
import { toast } from "react-toastify";

class EventStore {
  eventPins = [];

  constructor() {
    makeAutoObservable(this);
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
}

const eventStore = new EventStore();
export default eventStore;
