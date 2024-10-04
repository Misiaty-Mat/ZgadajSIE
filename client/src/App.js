import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/main-page/MainPage";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
};

export default App;
