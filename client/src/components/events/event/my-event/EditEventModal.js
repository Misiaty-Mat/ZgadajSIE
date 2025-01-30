import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import moment from "moment";
import BasicModal from "../../../modal/BasicModal";
import { useStores } from "../../../../contexts/stores-context";
import { EVENT_VALIDATION_SCHEMA } from "../../add-event/validation/schema";
import DateTimeStep from "../../add-event/form-steps/DateTimeStep";
import LocationStep from "../../add-event/form-steps/LocationStep";
import { editEvent } from "../../../../api/events/events";
import { toast } from "react-toastify";
import { handleError } from "../../../../api/utils";
import "./EditEventModal-style.css";

const EditEventModal = observer(({ isOpened, setIsOpened }) => {
  const [page, setPage] = useState("editInputs");
  const [eventTags, setEventTags] = useState([]);
  const formikRef = useRef();

  const { tagStore, eventStore } = useStores();

  useEffect(() => {
    const { eventId, ...editableData } = eventStore.targetEvent;
    setEventTags(
      tagStore.tagInputOptions.filter((tagOption) =>
        editableData.tagNames.includes(tagOption.label)
      )
    );

    formikRef.current?.setValues({ ...editableData });
  }, [eventStore.targetEvent, tagStore.tagInputOptions]);

  useEffect(() => {}, [
    eventStore.targetEvent.tagNames,
    tagStore.tagInputOptions,
  ]);

  const onValueChange = (e) => {
    formikRef.current.setFieldValue(e.target.name, e.target.value);
  };

  const handleTagPicked = (selectedTags) => {
    setEventTags(selectedTags);
    formikRef.current.setFieldValue(
      "tagIds",
      selectedTags.map((tag) => tag.value)
    );
  };

  const handleSubmit = (values) => {
    editEvent(eventStore.targetEvent.eventId, values)
      .then(() => {
        setIsOpened(false);
        toast.success("Pomyślnie zmieniono dane wydarzenia");
      })
      .catch((error) => handleError(error));
  };

  const getPage = ({ values, errors, isValid }) => {
    switch (page) {
      case "editInputs":
        return (
          <Form>
            <div className="divTitle">
              <label class="userForm--item-EditEvent">Tytuł</label>
              <input
                class="userInput userInput-EditEvent"
                name="title"
                value={values?.title}
                onChange={onValueChange}
              />
              <small>{errors.title}</small>
            </div>

            <div>
              <label class="userForm--item-EditEvent">
                Maksymalna liczba uczestników
              </label>
              <input
                class="userInput userInput-EditEvent"
                type="number"
                name="maxParticipation"
                value={values?.maxParticipation}
                onChange={onValueChange}
              />
              <small>{errors.maxParticipation}</small>
            </div>

            <div>
              <label class="userForm--item-EditEvent userForm--item-EditEvent-EditEvent">
                Miejsce
              </label>
              <p class="userForm--item-EditEvent userForm--item-EditEvent-EditEvent ">{`${values?.city} ${values?.street} ${values?.buildingNumber}`}</p>
              <button
                className="navBarUser-button buttonConfirm editEventButton"
                onClick={() => setPage("editLocation")}
              >
                Zmień miejsce
              </button>
            </div>

            <div>
              <label class="userInput userInput-EditEvent">Czas</label>
              <p>{moment(values?.startDate).format("DD.MM.YYYY hh:mm")}</p>
              <button
                className="navBarUser-button buttonConfirm editEventButton"
                onClick={() => setPage("editTime")}
              >
                Zmień czas
              </button>
            </div>

            <div>
              <label class="userForm--item-EditEvent">Opis</label>
              <textarea
                class="userInput userInput-EditEvent"
                name="description"
                value={values?.description}
                onChange={onValueChange}
              ></textarea>
            </div>

            <div>
              <Select
                className="fieldForm"
                isMulti
                value={eventTags}
                options={tagStore.tagInputOptions}
                onChange={handleTagPicked}
              />
              <small>{errors.tagIds}</small>
            </div>

            <button
              className="navBarUser-button buttonConfirm editEventButton"
              type="submit"
              disabled={!isValid}
            >
              Zapisz zmiany
            </button>
          </Form>
        );
      case "editTime":
        return (
          <>
            <DateTimeStep />
            <button
              className="navBarUser-button buttonConfirm editEventButton"
              onClick={() => setPage("editInputs")}
            >
              Potwierdź i wróć
            </button>
          </>
        );
      case "editLocation":
        return (
          <>
            <LocationStep />
            <button
              onClick={() => setPage("editInputs")}
              className="navBarUser-button buttonConfirm editEventButton"
            >
              Potwierdź i wróć
            </button>
          </>
        );
      default:
        return undefined;
    }
  };

  return (
    <BasicModal
      isOpen={isOpened}
      title="Edytuj wydarzenie"
      onClose={() => {
        formikRef.current.resetForm();
        setIsOpened(false);
      }}
    >
      <Formik
        initialValues={{ ...eventStore.targetEvent }}
        innerRef={formikRef}
        validationSchema={EVENT_VALIDATION_SCHEMA}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnMount
      >
        {getPage}
      </Formik>
    </BasicModal>
  );
});

export default EditEventModal;
