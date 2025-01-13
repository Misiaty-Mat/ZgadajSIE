import React, { useRef, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { useAuth } from "../../../../hooks/useAuth";

const LoginForm = ({ onSubmitExternal, onReturn }) => {
  const formikRef = useRef(null);

  const [step, setStep] = useState(1);
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const { login } = useAuth();

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
        setShouldSubmit(true);
        setNextStepDisabled(
          values.password === "" || errors.password !== undefined
        );
        return (
          <div>
            <label>Podaj swoje hasło:</label>
            <Field name="password" />
            {errors.password && <small>{errors.password}</small>}
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
          password: "",
        }}
        onSubmit={(values) => {
          login(values);
          onSubmitExternal();
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Musisz podać poprawny email")
            .required("Email jest wymaganym polem"),
          password: Yup.string()
            .required()
            .test(
              "length",
              "Hasło powinno zawierać przynajmniej 8 znaków",
              (val) => !val || (val && val.toString().length >= 8)
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
              {shouldSubmit === true ? "Zaloguj się!" : "Dalej"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default LoginForm;
