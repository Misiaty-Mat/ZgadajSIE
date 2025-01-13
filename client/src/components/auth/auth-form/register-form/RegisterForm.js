import React, { useRef, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { useAuth } from "../../../../hooks/useAuth";

const RegisterForm = ({ onSubmitExternal, onReturn }) => {
  const formikRef = useRef(null);

  const [step, setStep] = useState(1);
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const { register } = useAuth();

  const nextStep = async () => {
    if (shouldSubmit && formikRef.current) {
      await formikRef.current.submitForm();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setShouldSubmit(false);
    setStep((prev) => prev - 1);
  };

  const renderSteps = (values, errors) => {
    switch (step) {
      case 1:
        setNextStepDisabled(values.email === "" || errors.email !== undefined);
        return (
          <div>
            <label>Podaj swój email:</label>
            <Field name="email" />
            {errors.email && <small>{errors.email}</small>}
          </div>
        );
      case 2:
        setNextStepDisabled(values.name === "" || errors.name !== undefined);
        return (
          <div>
            <label>Jak chcesz się nazywać?</label>
            <Field name="name" />
            {errors.name && <small>{errors.name}</small>}
          </div>
        );
      case 3:
        setShouldSubmit(true);
        setNextStepDisabled(
          values.password === "" ||
            values.confirmPassword === "" ||
            errors.password !== undefined ||
            errors.confirmPassword !== undefined
        );
        return (
          <div>
            <div>
              <label>Podaj swoje hasło:</label>
              <Field name="password" type="password" />
              {errors.password && <small>{errors.password}</small>}
            </div>
            <div>
              <label>Potwierdź swoje hasło</label>
              <Field name="confirmPassword" type="password" />

              {errors.confirmPassword && (
                <small>{errors.confirmPassword}</small>
              )}
            </div>
          </div>
        );
      default:
        return undefined;
    }
  };

  return (
    <div>
      <Formik
        innerRef={formikRef}
        validateOnChange
        initialValues={{
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => {
          register(values);
          onSubmitExternal();
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Podany email nie jest poprawny")
            .required("Musisz podać email do swojego profilu"),
          name: Yup.string().required("Musisz podać nazwę swojego profilu"),
          password: Yup.string()
            .required("Musisz podać swoje hasło")
            .test(
              "length",
              "Hasło musi mieć przynajmniej 8 znaków",
              (val) => !val || (val && val.toString().length >= 8)
            )
            .test(
              "hasNumber",
              "Hasło musi zawierać przynajmniej jedną liczbę [0-9]",
              (val) => /\d/.test(val)
            ),
          confirmPassword: Yup.string().equals(
            [Yup.ref("password")],
            "Powtórzone hasło nie jest takie same jak w poprzednim polu"
          ),
        })}
      >
        {({ values, errors }) => (
          <Form>
            {renderSteps(values, errors)}
            <button type="button" onClick={step === 1 ? onReturn : prevStep}>
              Powrót
            </button>
            <button
              type="button"
              disabled={nextStepDisabled}
              onClick={nextStep}
            >
              {shouldSubmit === true ? "Zarejestruj się!" : "Dalej"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default RegisterForm;
