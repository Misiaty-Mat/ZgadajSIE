import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import EmailStep from "../form-steps/EmailStep";
import PasswordStep from "../form-steps/PasswordStep";
import ConfirmPasswordStep from "../form-steps/ConfirmPasswordStep";

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

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
          onSubmit();
        }}
        validationSchema={Yup.object({
          email: Yup.string().email().required(),
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
        {({ values, errors }) => (
          <Form>
            {step === 1 && (
              <EmailStep
                nextStep={nextStep}
                prevStep={onReturn}
                errors={errors.email}
                nextStepDisabled={
                  values.email === "" || errors.email !== undefined
                }
              />
            )}
            {step === 2 && (
              <PasswordStep
                prevStep={prevStep}
                nextStep={nextStep}
                errors={errors.password}
                nextStepDisabled={
                  values.password === "" || errors.password !== undefined
                }
              />
            )}
            {step === 3 && (
              <ConfirmPasswordStep
                prevStep={prevStep}
                errors={errors.confirmPassword}
                submitDisabled={
                  values.confirmPassword === "" ||
                  errors.confirmPassword !== undefined
                }
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default RegisterForm;
