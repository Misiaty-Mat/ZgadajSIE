import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getUserProfile, updateUserProfile } from "../../../api/user/user";
import { handleError } from "../../../api/utils";
import NavBar from "../../nav-bar/NavBar";
import { useAuth } from "../../../hooks/useAuth";

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const formikRef = useRef();

  const navigate = useNavigate();
  const { setUsername } = useAuth();

  const fetchProfile = useCallback(() => {
    getUserProfile()
      .then((response) => {
        setProfile(response.data.profile);
      })
      .catch((error) => {
        handleError(error);
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    setUsername(profile.name);
  }, [profile.name, setUsername]);

  useEffect(() => {
    if (profile) {
      const { id, email, ...editableData } = profile;
      formikRef.current?.setValues({ ...editableData });
    }
  }, [profile]);

  const toggleEditingMode = () => {
    setIsEditing((prev) => !prev);
  };

  const onValueChange = (e) => {
    formikRef.current.setFieldValue(e.target.name, e.target.value);
  };

  const getContent = ({ values, errors }) => {
    if (isEditing) {
      return (
        <div>
          <Form>
            <p>
              Nazwa użytkownika:
              <Field name="name" value={values.name} onChange={onValueChange} />
            </p>
            <small>{errors.name}</small>

            <p>Email: {profile.email}</p>

            <p>
              Wiek:
              <Field
                name="age"
                type="number"
                value={values.age}
                onChange={onValueChange}
              />
            </p>
            <small>{errors.age}</small>

            <p>
              Płeć:{" "}
              <Field
                name="gender"
                value={values.gender}
                onChange={onValueChange}
              />
            </p>

            <p>
              Opis:
              <Field
                name="description"
                as="textarea"
                value={values.description}
                onChange={onValueChange}
              />
            </p>

            <button type="submit">Potwierdź</button>
          </Form>
        </div>
      );
    } else {
      return (
        <div>
          <p>Nazwa użytkownika: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Wiek: {profile.age || "Nie podano"}</p>
          <p>Płeć: {profile.gender || "Nie podano"}</p>
          <p>Opis: {profile.description || "Brak"}</p>
        </div>
      );
    }
  };

  const handleSubmit = (values) => {
    updateUserProfile(values)
      .then(() => {
        toast.success("Pomyślnie zaktualizowano profil");
        fetchProfile();
        setIsEditing(false);
      })
      .catch((error) => handleError(error));
  };

  return (
    <div>
      <h1>Twój profil</h1>
      <NavBar />
      <Formik
        innerRef={formikRef}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          name: Yup.string().required("Musisz posiadać nazwę użytkownika"),
          age: Yup.number()
            .integer("Musisz podać liczbę całkowitą")
            .min(18, "Podaj poprawny wiek")
            .max(150, "Wiek jest za dużą liczbą")
            .nullable(),
        })}
        validateOnChange
      >
        {getContent}
      </Formik>
      <button onClick={toggleEditingMode}>
        {isEditing ? "Anuluj" : "Edytuj"}
      </button>
    </div>
  );
};

export default UserProfile;
