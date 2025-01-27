import React from "react";
import eventStore from "../store/event-store";
import tagStore from "../store/tag-store";

const StoreContext = React.createContext({
  eventStore,
  tagStore,
});

export const useStores = () => React.useContext(StoreContext);
