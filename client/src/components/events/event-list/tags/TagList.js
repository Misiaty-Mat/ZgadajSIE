import { useEffect, useState } from "react";
import { useStores } from "../../../../contexts/stores-context";
import TagButton from "./TagButton";
import { observer } from "mobx-react-lite";

const TagList = observer(({ tagSetter }) => {
  const [tagFilter, setTagFilter] = useState({});
  const { tagStore } = useStores();

  useEffect(() => {
    tagSetter(
      Object.entries(tagFilter).reduce((acc, [tagName, chosen]) => {
        if (chosen) {
          acc.push(tagName);
        }

        return acc;
      }, [])
    );
  }, [tagFilter, tagSetter]);

  const changeTagFilter = (tagName) => {
    setTagFilter((prev) => {
      if (prev[tagName]) {
        prev[tagName] = !prev[tagName];
      } else {
        prev[tagName] = true;
      }

      return { ...prev };
    });
  };

  return (
    <div className="main-page-sectionLeft-Tags">
      {tagStore.tags.map((tag) => (
        <TagButton
          key={tag.id}
          tag={tag}
          onClick={() => changeTagFilter(tag.name)}
        />
      ))}
    </div>
  );
});

export default TagList;
