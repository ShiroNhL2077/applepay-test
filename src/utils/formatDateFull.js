export const formatDateFull = (inputDate) => {
    if (!inputDate) {
      return;
    }
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(inputDate);
    const dd = date.getUTCDate();
    const mm = months[date.getUTCMonth()];
    const yyyy = date.getUTCFullYear();

    const formattedDate = `${dd} ${mm}, ${yyyy}`;

    return formattedDate;
  }