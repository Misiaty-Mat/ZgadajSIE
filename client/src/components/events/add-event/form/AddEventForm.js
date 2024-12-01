import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import TitleStep from "../form-steps/TitleStep";
import LocationStep from "../form-steps/LocationStep";

const AddEventForm = ({ onSubmitExternal, onReturn }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderSteps = (values, errors) => {
    switch (step) {
      case 1:
        return (
          <TitleStep
            nextStep={nextStep}
            prevStep={onReturn}
            errors={errors.title}
            nextStepDisabled={values.title === "" || errors.title !== undefined}
          />
        );
      case 2:
        return (
          <LocationStep
            prevStep={prevStep}
            errors={errors.location}
            nextStepDisabled={
              values.locationLat === null || values.locationLng === null
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
          title: "",
          locationLat: null,
          locationLng: null,
        }}
        onSubmit={(values) => {
          onSubmitExternal();
          alert(JSON.stringify(values));
        }}
        validationSchema={Yup.object({
          title: Yup.string().required(),
        })}
      >
        {({ values, errors }) => <Form>{renderSteps(values, errors)}</Form>}
      </Formik>
    </div>
  );
};

export default AddEventForm;
