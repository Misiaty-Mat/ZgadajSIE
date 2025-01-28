import { useState } from "react";

import "./TagButton-style.css";
import { Tooltip } from "react-tooltip";

const TagButton = ({ tag, onClick }) => {
  const [isChosen, setIsChosen] = useState(false);

  const toggleSwitch = () => {
    setIsChosen((prev) => !prev);
    onClick();
  };

  return (
    <>
      <button
        onClick={toggleSwitch}
        className={isChosen ? "tag-button-chosen" : "tag-button-not-chosen"}
        data-tooltip-id={`button-${tag.id}-tooltip`}
        data-tooltip-content={tag.description}
      >
        #{tag.name}
      </button>
      <Tooltip id={`button-${tag.id}-tooltip`} />
    </>
  );
};

export default TagButton;
