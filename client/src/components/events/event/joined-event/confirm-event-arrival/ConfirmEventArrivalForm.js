import { useFormik } from "formik";

import * as Yup from "yup";
import QRCodeScanner from "../../../../qr-scanner/QRCodeScanner";
import { useState } from "react";
import { confirmEventArrival } from "../../../../../api/events/events";
import { toast } from "react-toastify";
import { handleError } from "../../../../../api/utils";
import "./ConfirmEventArrivalForm--style.css";

const ConfirmEventArrivalForm = ({ eventId, onSubmit }) => {
  const [code, setCode] = useState("");

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: Yup.object({
      code: Yup.string().required("Musisz zeskanować lub wprowadzić kod"),
    }),
    onSubmit: (values) => {
      confirmEventArrival(eventId, values.code)
        .then(() => {
          toast.success("Pomyślnie potwierdzono przybycie na wydarzenie");
        })
        .catch((error) => handleError(error));
      onSubmit();
    },
    validateOnChange: true,
    validateOnMount: true,
  });

  const onCodeChange = (code) => {
    formik.setValues({ code: code });
    setCode(code);
  };

  return (
    <form className="eventViev" onSubmit={formik.handleSubmit}>
      {!code && <QRCodeScanner onScanned={onCodeChange} />}
      <label className="eventViev--item">Lub wpisz kod ręcznie:</label>
      <input
        className="userInput userInput-cofirmCode"
        name="code"
        value={formik.values.code}
        onChange={(e) => onCodeChange(e.target.value)}
      />

      {formik.errors.code && <p>{formik.errors.code}</p>}

      <button
        className="navBarUser-button buttonConfirm buttonConfirmEvent"
        type="submit"
        disabled={!!formik.errors.code || !code}
      >
        Potwierdź
      </button>
    </form>
  );
};

export default ConfirmEventArrivalForm;
