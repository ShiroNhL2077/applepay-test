export const eventInitDates = [
  { id: "2024/03/09", day: "09", weekDay: "Saturday", month: "March" },
  { id: "2024/03/10", day: "10", weekDay: "Sunday", month: "March" },
  { id: "2024/03/11", day: "11", weekDay: "Monday", month: "March" },
  { id: "2024/03/12", day: "12", weekDay: "Tuesday", month: "March" },
  { id: "2024/03/13", day: "13", weekDay: "Wednesday", month: "March" },
  { id: "2024/03/14", day: "14", weekDay: "Thursday", month: "March" },
  { id: "2024/03/15", day: "15", weekDay: "Friday", month: "March" },
  { id: "2024/03/16", day: "16", weekDay: "Saturday", month: "March" },
  { id: "2024/03/17", day: "17", weekDay: "Sunday", month: "March" },
  { id: "2024/03/18", day: "18", weekDay: "Monday", month: "March" },
  { id: "2024/03/19", day: "19", weekDay: "Tuesday", month: "March" },
  { id: "2024/03/20", day: "20", weekDay: "Wednesday", month: "March" },
  { id: "2024/03/21", day: "21", weekDay: "Thursday", month: "March" },
  { id: "2024/03/22", day: "22", weekDay: "Friday", month: "March" },
  { id: "2024/03/23", day: "23", weekDay: "Saturday", month: "March" },
  { id: "2024/03/24", day: "24", weekDay: "Sunday", month: "March" },
  { id: "2024/03/25", day: "25", weekDay: "Monday", month: "March" },
  { id: "2024/03/26", day: "26", weekDay: "Tuesday", month: "March" },
  { id: "2024/03/27", day: "27", weekDay: "Wednesday", month: "March" },
  { id: "2024/03/28", day: "28", weekDay: "Thursday", month: "March" },
  { id: "2024/03/29", day: "29", weekDay: "Friday", month: "March" },
  { id: "2024/03/30", day: "30", weekDay: "Saturday", month: "March" },
  { id: "2024/03/31", day: "31", weekDay: "Sunday", month: "March" },
  { id: "2024/04/01", day: "01", weekDay: "Monday", month: "April" },
  { id: "2024/04/02", day: "02", weekDay: "Tuesday", month: "April" },
  { id: "2024/04/03", day: "03", weekDay: "Wednesday", month: "April" },
  { id: "2024/04/04", day: "04", weekDay: "Thursday", month: "April" },
  { id: "2024/04/05", day: "05", weekDay: "Friday", month: "April" },
  { id: "2024/04/06", day: "06", weekDay: "Saturday", month: "April" },
  { id: "2024/04/07", day: "07", weekDay: "Sunday", month: "April" },
];



export const formatDateToDDMMYYYY = (isoDate) => {
  if (!isoDate) {
    return;
  }
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatTimeToHHMM = (timeString) => {
  if (!timeString) {
    return;
  }
  const parts = timeString.split(":");
  const hours = parts[0];
  const minutes = parts[1];

  return `${hours}:${minutes}`;
};

export const getTotalPrice = (items) => {
  // Iterate through the items and calculate the total price
  let totalPrice = 0;
  for (const item of items) {
    totalPrice += item.orderQty * item.price;
  }
  return totalPrice.toFixed(1);
};
