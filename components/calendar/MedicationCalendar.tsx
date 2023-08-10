import { useState } from "react";
import { MonthlyNav } from "./MonthlyNav";

import { format, startOfMonth } from "date-fns";

import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
} from "@zach.codes/react-calendar";

import { Medication } from "@/types/medicationTypes";

type MedicationInfoProps = {
  loggedMedication: Medication;
};

function MedicationInfo({ loggedMedication }: MedicationInfoProps) {
  return (
    <div className="flex justify-between text-black">
      <div className="ml-2">{loggedMedication.name}</div>
      <div className="mr-2">{loggedMedication.timeTaken}</div>
    </div>
  );
}
type MedicationCalendarProps = {
  medications: Medication[];
};

function processMedicationData(medications: Medication[]) {
  return medications.map((medication) => {
    const dateTaken = new Date(medication.dateTaken);
    const timeTaken = dateTaken.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const sortableTimestamp =
      dateTaken.getTime() +
      (timeTaken.includes("PM") ? 12 * 60 * 60 * 1000 : 0);

    return {
      ...medication,
      date: dateTaken,
      timeTaken: timeTaken,
      sortableTimestamp: sortableTimestamp,
    };
  });
}



function MedicationCalendar({ medications }: MedicationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  const medicationsWithDates = processMedicationData(medications);
  medicationsWithDates.sort(
    (a, b) => a.sortableTimestamp - b.sortableTimestamp
  );

  return (
    <>
      <MonthlyCalendar
        currentMonth={currentMonth}
        onCurrentMonthChange={(date) => setCurrentMonth(date)}
      >
        <MonthlyNav />
        <div className=" text-black">
          <MonthlyBody events={medicationsWithDates}>
            <MonthlyDay<Medication>
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
