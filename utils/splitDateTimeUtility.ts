import format from "date-fns/format";

export function splitDateTime(dateTime: string | number | Date) {
  const dateTaken = new Date(dateTime);
  const formattedDate = format(dateTaken, "MM/dd/yy");
  const formattedTime = format(dateTaken, "hh:mm a");
  return { formattedDate, formattedTime };
}
