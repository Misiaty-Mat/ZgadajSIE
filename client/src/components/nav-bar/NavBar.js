import { useEffect, useState } from "react";
import AuthModalButton from "../auth/auth-modal-button/AuthModalButton";
import LogoutButton from "../auth/logout-button/LogoutButton";
import ConfirmEventArrivalButton from "../events/confirm-event-arrival/ConfirmEventArivalButton";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [name, setName] = useState();

  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    setName(user?.name);
  }, [user]);

  const getAvailableButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <button onClick={() => navigate("/")}>Wszystkie wydarzenia</button>
          <button onClick={() => navigate("/created-events")}>
            Moje wydarzenia
          </button>
          <button onClick={() => navigate("/joined-events")}>
            Dołączone wydarzenia
          </button>
          <ConfirmEventArrivalButton />
          <LogoutButton />
        </>
      );
    } else {
      return <AuthModalButton />;
    }
  };

  return (
    <div className="nav">
      <div class="nav-userLabel">
        {getAvailableButtons()} <h2>{name}</h2>
        <img className="nav-userLabel-img" src="./user.png" alt=""></img>
        <span className="nav-userLabel-arrow">&#129171;</span>
      </div>
    </div>
  );
};

export default NavBar;
