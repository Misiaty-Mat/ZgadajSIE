import {useFormik} from "formik";

import * as Yup from "yup";
import QRCodeScanner from "../../../qr-scanner/QRCodeScanner";
import {useState} from "react";

const ConfirmEventArrivalForm = () => {
    const [code, setCode] = useState('');

    const formik = useFormik({
        initialValues: {code: ""},
        validationSchema: Yup.object({
            code: Yup.string().required(),
        }),
        onSubmit: (values) => {
            alert(JSON.stringify(values));
        },
        validateOnChange: true,
        validateOnMount: true,
    });

    const onCodeChange = (code) => {
        formik.setValues({code: code});
        setCode(code);
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            {!code && (<QRCodeScanner onScanned={onCodeChange}/>)}
            <label>Or enter your code manually:</label>
            <input name="code" value={formik.values.code} onChange={e => onCodeChange(e.target.value)}/>

            {formik.errors.code && <p>{formik.errors.code}</p>}

            <button
                type="submit"
                disabled={!!formik.errors.code || !code}
            >
                Confirm
            </button>
        </form>
    );
};

export default ConfirmEventArrivalForm;