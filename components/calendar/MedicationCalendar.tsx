import { useEffect, useState } from "react";
import { MonthlyNav } from "./MonthlyNav";

import { format, startOfMonth } from "date-fns";

import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
} from "@zach.codes/react-calendar";

import { LoggedMedication } from "@/types/medicationTypes";

type MedicationInfoProps = {
  loggedMedication: LoggedMedication;
};

function MedicationInfo({ loggedMedication }: MedicationInfoProps) {
  const formattedTime = format(
    new Date(`01/01/2000 ${loggedMedication.timeTaken}`),
    "h:mma"
  );

  return (
    <>
      <div className="flex justify-between">
        <p className="text-sm font-medium mr-2">{loggedMedication.name}</p>
        <p className="text-sm font-medium mr-2">{formattedTime}</p>
      </div>
    </>
  );
}

type MedicationCalendarProps = {
  medications: LoggedMedication[];
};

function MedicationCalendar({ medications }: MedicationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  const medicationsWithDates =
    medications
      ?.filter((medication) => medication.dateTaken?.getTime())
      .map(({ timeTaken, ...medication }) => {
        const [hours, minutes] = timeTaken
          .split(":")
          .map((str) => parseInt(str));
        const medicationDate = new Date(
          medication.dateTaken!.getFullYear(),
          medication.dateTaken!.getMonth(),
          medication.dateTaken!.getDate(),
          hours,
          minutes
        );
        return {
          ...medication,
          date: medicationDate,
          time: `${timeTaken.slice(0, -3)}${timeTaken.slice(-3)}`,
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
        <div className="border-b-2 border-t-2 border-l-2 border-r-2 text-base font-normal text-gray-900">
          <MonthlyBody events={medicationsWithDates}>
            <MonthlyDay<LoggedMedication>
              renderDay={(data) =>
                data.map((medication, index) => (
                  <MedicationInfo key={index} loggedMedication={medication} />
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
