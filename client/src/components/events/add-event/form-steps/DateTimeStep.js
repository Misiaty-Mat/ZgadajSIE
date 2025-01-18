import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";

import "moment/locale/pl";
import { useFormikContext } from "formik";

const DateTimeStep = () => {
  const formik = useFormikContext();

  const onChange = (value) => {
    formik.setFieldValue("startDate", value.toISOString());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="pl">
      <StaticDateTimePicker
        label="Czas wydarzenia"
        onChange={onChange}
        format="DD-MM-YYYY HH:mm"
        showDaysOutsideCurrentMonth
        disablePast
        slotProps={{
          toolbar: {
            toolbarTitle: "",
          },
          actionBar: {
            actions: [],
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateTimeStep;
