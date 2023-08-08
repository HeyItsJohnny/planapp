export function convertDateFormat(inputDate) {
  if (inputDate === "") {
    return;
  }
  const [year, month, day] = inputDate.split("-");
  const dateObject = new Date(year, parseInt(month) - 1, day);
  const formattedMonth = (dateObject.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const formattedDay = dateObject.getDate().toString().padStart(2, "0");
  const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;

  return formattedDate;
}
