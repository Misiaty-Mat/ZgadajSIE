import { useEffect, useState } from "react";
import AuthModalButton from "../auth/auth-modal-button/AuthModalButton";
import LogoutButton from "../auth/logout-button/LogoutButton";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./navBar-style.css";

const NavBar = () => {
  const [name, setName] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    setName(user?.name);
  }, [user]);

  const getAvailableButtons = () => {
    if (isLoggedIn) {
      return (
        <div className="nav-userLabel">
          {/* Strzałka rozwijająca menu */}
          <img
            className="nav-userLabel-imgArrow"
            src="./arrow.png"
            alt="Arrow"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            style={{
              cursor: "pointer",
              transition: "transform 0.3s ease",
              transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />

          {/* Rozwijana lista */}
          {isMenuOpen && (
            <div className="nav-userLabel-menu">
              <button
                className="nav-userLabel-button"
                onClick={() => navigate("/")}
              >
                Wszystkie wydarzenia
              </button>
              <button
                className="nav-userLabel-button"
                onClick={() => navigate("/created-events")}
              >
                Moje wydarzenia
              </button>
              <button
                className="nav-userLabel-button"
                onClick={() => navigate("/joined-events")}
              >
                Dołączone wydarzenia
              </button>
              <LogoutButton />
            </div>
          )}
        </div>
      );
    } else {
      return <AuthModalButton />;
    }
  };

  return (
    <div className="nav">
      <div className="nav-userLabel">
        {getAvailableButtons()} <h2>{name}</h2>
        <img className="nav-userLabel-img" src="./user.png" alt=""></img>
      </div>
    </div>
  );
};

export default NavBar;
