import { useState } from "react";
import { MonthlyNav } from "./MonthlyNav";

import { format, startOfMonth } from "date-fns";

import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
} from "@zach.codes/react-calendar";

export type Medication = {
  name: string;
  date: Date;
  time: string;
  windowStart?: string;
  windowEnd?: string;
  notificationsEnabled?: string;
};

function MedicationInfo({
  name,
  date,
  time,
  windowStart,
  windowEnd,
  notificationsEnabled,
}: Medication) {
  const formattedTime = format(new Date(`01/01/2000 ${time}`), "h:mma");

  return (
    <>
      <div>
        <div className="flex justify-between">
          <p>{name}</p>
          <p>{formattedTime}</p>
        </div>
        {windowStart && windowEnd && (
          <>
            <p>
              Window: {windowStart} - {windowEnd}
            </p>
            <p>Notifications enabled: {notificationsEnabled ? "Yes" : "No"}</p>
          </>
        )}
      </div>
    </>
  );
}

type MedicationCalendarProps = {
  medications: Medication[];
};

function MedicationCalendar({ medications }: MedicationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  const medicationsWithDates =
    medications
      ?.filter((medication) => medication.date?.getTime())
      .map(({ time, ...medication }) => {
        const [hours, minutes] = time.split(":").map((str) => parseInt(str));
        const medicationDate = new Date(
          medication.date!.getFullYear(),
          medication.date!.getMonth(),
          medication.date!.getDate(),
          hours,
          minutes
        );
        return {
          ...medication,
          date: medicationDate,
          time: `${time.slice(0, -3)}${time.slice(-3)}`,
        };
      })
      .sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
      }) || [];

  return (
    <>
      <MonthlyCalendar
        currentMonth={currentMonth}
        onCurrentMonthChange={(date) => setCurrentMonth(date)}
      >
        <MonthlyNav />
        <div className="border-b-2 border-t-2 border-l-2 border-r-2">
          <MonthlyBody events={medicationsWithDates}>
            <MonthlyDay<Medication>
              renderDay={(data) =>
                data.map((medication, index) => (
                  <MedicationInfo
                    key={index}
                    name={medication.name}
                    date={medication.date}
                    time={medication.time}
                    windowStart={medication.windowStart}
                    windowEnd={medication.windowEnd}
                    notificationsEnabled={medication.notificationsEnabled}
                  />
                ))
              }
            />
          </MonthlyBody>
        </div>
      </MonthlyCalendar>
    </>
  );
}

export default MedicationCalendar;
