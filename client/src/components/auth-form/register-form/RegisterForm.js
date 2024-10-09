import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import EmailStep from "../form-steps/EmailStep";
import PasswordStep from "../form-steps/PasswordStep";
import ConfirmPasswordStep from "../form-steps/ConfirmPasswordStep";
import NameStep from "../form-steps/NameStep";

const RegisterForm = ({ onSubmit, onReturn }) => {
  const [step, setStep] = useState(1);

  // Proceed to the next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Go back to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  const renderSteps = (values, errors) => {
    switch (step) {
      case 1:
        return (
          <EmailStep
            nextStep={nextStep}
            prevStep={onReturn}
            errors={errors.email}
            nextStepDisabled={values.email === "" || errors.email !== undefined}
          />
        );
      case 2:
        return (
          <NameStep
            nextStep={nextStep}
            prevStep={prevStep}
            errors={errors.name}
            nextStepDisabled={values.name === "" || errors.name !== undefined}
          />
        );
      case 3:
        return (
          <PasswordStep
            nextStep={nextStep}
            prevStep={prevStep}
            errors={errors.password}
            nextStepDisabled={
              values.password === "" || errors.password !== undefined
            }
          />
        );
      case 4:
        return (
          <ConfirmPasswordStep
            nextStep={nextStep}
            prevStep={prevStep}
            errors={errors.confirmPassword}
            nextStepDisabled={
              values.confirmPassword === "" ||
              errors.confirmPassword !== undefined
            }
          />
        );

      default:
        return undefined;
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
          onSubmit();
        }}
        validationSchema={Yup.object({
          email: Yup.string().email().required(),
          name: Yup.string().required(),
          password: Yup.string()
            .required()
            .test(
              "length",
              "Passport must have more than 8 characters",
              (val) => !val || (val && val.toString().length >= 8)
            ),
          confirmPassword: Yup.string().equals(
            [Yup.ref("password")],
            "Passwords must match"
          ),
        })}
      >
        {({ values, errors }) => <Form>{renderSteps(values, errors)}</Form>}
      </Formik>
    </div>
  );
};
export default RegisterForm;
