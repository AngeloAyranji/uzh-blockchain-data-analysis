export const dateToDayMonth = (date: Date) => {
  const day = date.getDate();
  const month = Months[date.getMonth()];

  return `${day}-${month}`;
};

export const dateToMonthYear = (date: Date) => {
  const month = Months[date.getMonth()];
  const year = date.getUTCFullYear();

  return `${month}-${year}`;
};

export const dateToYear = (date: Date) => {
  const year = date.getUTCFullYear();

  return `${year}`;
};

export const dateToWeek = (date: Date) => {
  const firstDayOfWeek = new Date(date);
  const dayOfWeek = date.getUTCDay();
  const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  firstDayOfWeek.setDate(date.getDate() + difference);

  const month = Months[firstDayOfWeek.getMonth()];
  const day = firstDayOfWeek.getDate();

  return `${day}-${month}`;
};

export const Months: { [key: number]: string } = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};
