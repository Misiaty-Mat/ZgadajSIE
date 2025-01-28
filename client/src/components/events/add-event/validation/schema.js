import * as Yup from "yup";

export const EVENT_VALIDATION_SCHEMA = Yup.object({
  title: Yup.string().required("Wydarzenie musi mieć nazwę!"),
  buildingNumber: Yup.string().required(
    "Musisz wybrać miejsce gdzie odbędzie sie twoje wydarzenie!"
  ),
  startDate: Yup.date().required(
    "Musisz wybrać kiedy ma się rozpocząć wydarzenie!"
  ),
  maxParticipation: Yup.number()
    .integer("Musisz podać liczbę całkowitą")
    .nullable(),
  tagIds: Yup.array()
    .of(
      Yup.string().required(
        "Wybierz do 3 oznaczeń, by łatwiej znaleźć twoje wydarzenie!"
      )
    )
    .max(3, "Możesz wybrać do 3 oznaczeń"),
});
