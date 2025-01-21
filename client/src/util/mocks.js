import moment from "moment";

export const EVENT_LIST_MOCK = [
  {
    id: "1",
    title: "Wyprawa w góry",
    city: "Poznań",
    startDate: moment().add(3, "d").toISOString(),
    participation: 6,
    maxParticipation: 10,
  },
  {
    id: "2",
    title: "Wyprawa na kebaba",
    city: "Poznań",
    startDate: moment().add(1, "d").toISOString(),
    participation: 5,
    maxParticipation: null,
  },
  {
    id: "3",
    title: "Spacer po parku",
    city: "Poznań",
    startDate: moment().add(6, "d").toISOString(),
    participation: 2,
    maxParticipation: 4,
  },
  {
    id: "4",
    title: "Budowa CRUDa",
    city: "Poznań",
    startDate: moment().add(5, "d").toISOString(),
    participation: 176,
    maxParticipation: null,
  },
];
