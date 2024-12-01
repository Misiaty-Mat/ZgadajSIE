import React, {useState} from "react";
import {Form, Formik} from "formik";
import * as Yup from "yup";

import EmailStep from "../form-steps/EmailStep";
import PasswordStep from "../form-steps/PasswordStep";
import {useAuth} from "../../../../hooks/useAuth";

const LoginForm = ({onSubmitExternal, onReturn}) => {
    const [step, setStep] = useState(1);

    const {login} = useAuth();

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
                    <EmailStep
                        nextStep={nextStep}
                        prevStep={onReturn}
                        errors={errors.email}
                        nextStepDisabled={values.email === "" || errors.email !== undefined}
                    />
                );
            case 2:
                return (
                    <PasswordStep
                        prevStep={prevStep}
                        submitVisable={true}
                        submitDisabled={
                            values.password === "" || errors.password !== undefined
                        }
                        errors={errors.password}
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
                    password: "",
                }}
                onSubmit={(values) => {
                    login(values)
                    onSubmitExternal();
                }}
                validationSchema={Yup.object({
                    email: Yup.string().email().required(),
                    password: Yup.string()
                        .required()
                        .test(
                            "length",
                            "Password is to short",
                            (val) => !val || (val && val.toString().length >= 8)
                        ),
                })}
            >
                {({values, errors}) => <Form>{renderSteps(values, errors)}</Form>}
            </Formik>
        </div>
    );
};
export default LoginForm;
