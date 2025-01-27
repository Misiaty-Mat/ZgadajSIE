import { useState } from "react";

import "./TagButton-style.css";

const TagButton = ({ tag, onClick }) => {
  const [isChosen, setIsChosen] = useState(false);

  const toggleSwitch = () => {
    setIsChosen((prev) => !prev);
    onClick();
  };

  return (
    <button
      onClick={toggleSwitch}
      className={isChosen ? "tag-button-chosen" : "tag-button-not-chosen"}
    >
      #{tag.name}
    </button>
  );
};

export default TagButton;
