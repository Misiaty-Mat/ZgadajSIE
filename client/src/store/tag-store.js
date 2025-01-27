import { makeAutoObservable } from "mobx";
import { fetchAllTags } from "../api/tags/tags";
import { handleError } from "../api/utils";

class TagStore {
  tags = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchTags() {
    fetchAllTags()
      .then((response) => {
        this.tags = response.data;
      })
      .catch((error) => handleError(error));
  }
}

const tagStore = new TagStore();
export default tagStore;
