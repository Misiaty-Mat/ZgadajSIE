import React, { useState } from "react";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";

import EmailStep from "../form-steps/EmailStep";
import { useNavigate } from "react-router-dom";
import PasswordStep from "../form-steps/PasswordStep";

const LoginForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

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
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values));
          navigate("/");
        }}
        validationSchema={Yup.object({
          email: Yup.string().email().required(),
          password: Yup.string().required(),
        })}
      >
        {({ values, errors }) => (
          <Form>
            {step === 1 && (
              <EmailStep
                nextStep={nextStep}
                errors={errors.email}
                nextStepDisabled={
                  values.email === "" || errors.email !== undefined
                }
              />
            )}
            {step === 2 && (
              <>
                <PasswordStep prevStep={prevStep} errors={errors.password} />
                <button
                  type="submit"
                  disabled={
                    values.password === "" || errors.password !== undefined
                  }
                >
                  Submit
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default LoginForm;
