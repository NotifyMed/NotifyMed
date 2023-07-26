import { parse } from "date-fns";

export function setTime(date: Date, time: string) {
  return parse(`${date} ${time}:00`, "yyyy-MM-dd HH:mm:ss", new Date());
}
