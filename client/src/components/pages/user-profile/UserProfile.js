import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getUserProfile, updateUserProfile } from "../../../api/user/user";
import { handleError } from "../../../api/utils";
import NavBar from "../../nav-bar/NavBar";
import { useAuth } from "../../../hooks/useAuth";
import "./UserProfile-style.css";

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
        <div className="user-mainContainer">
          <Form>
            <p className="userForm--item">
              Nazwa użytkownika:
              <Field
                className="userInput"
                name="name"
                value={values.name}
                onChange={onValueChange}
              />
            </p>
            <small>{errors.name}</small>

            <p className="userForm--item">Email: {profile.email}</p>

            <p className="userForm--item">
              Wiek:
              <Field
                className="userInput"
                name="age"
                type="number"
                value={values.age}
                onChange={onValueChange}
              />
            </p>
            <small>{errors.age}</small>

            <p className="userForm--item">
              Płeć:{" "}
              <Field
                className="userInput"
                name="gender"
                value={values.gender}
                onChange={onValueChange}
              />
            </p>

            <p className="userForm--item">
              Opis:
              <Field
                className="userInput"
                name="description"
                as="textarea"
                value={values.description}
                onChange={onValueChange}
              />
            </p>

            <button className="navBarUser-button buttonConfirm" type="submit">
              Potwierdź
            </button>
          </Form>
        </div>
      );
    } else {
      return (
        <div className="userForm">
          <p className="userForm--item">Nazwa użytkownika: {profile.name}</p>
          <p className="userForm--item">Email: {profile.email}</p>
          <p className="userForm--item">Wiek: {profile.age || "Nie podano"}</p>
          <p className="userForm--item">
            Płeć: {profile.gender || "Nie podano"}
          </p>
          <p className="userForm--item">
            Opis: {profile.description || "Brak"}
          </p>
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
    <>
      <div className="navBarUser">
        <NavBar />
      </div>
      <div className="user-mainContainer">
        <h1 className="user-mainContainer--header">Twój profil</h1>
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
        <button className="navBarUser-button" onClick={toggleEditingMode}>
          {isEditing ? "Anuluj" : "Edytuj"}
        </button>
      </div>
    </>
  );
};

export default UserProfile;
