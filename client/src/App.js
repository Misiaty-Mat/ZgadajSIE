import { Route, Routes } from "react-router-dom";
import MainPage from "./components/pages/main-page/MainPage";
import { UserContextProvider } from "./contexts/user-context";
import CreatedEvents from "./components/pages/my-events/CreatedEvents";
import JoinedEvents from "./components/pages/joined-events/JoinedEvents";
import { useStores } from "./contexts/event-context";
import EventModal from "./components/event-modal/EventModal";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  const { eventStore } = useStores();

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/created-events" element={<CreatedEvents />} />
        <Route path="/joined-events" element={<JoinedEvents />} />
      </Routes>

      {eventStore.selectedEvent && <EventModal />}
    </UserContextProvider>
  );
});

export default App;
