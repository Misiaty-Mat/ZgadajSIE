import React from "react";
import eventStore from "../store/event-store";

const StoreContext = React.createContext({
  eventStore,
});

export const useStores = () => React.useContext(StoreContext);
