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
      <div className="ml-2">{loggedMedication.id}</div>
      <div className="mr-2">{loggedMedication.timeTaken}</div>
    </div>
  );
}

type MedicationCalendarProps = {
  medications: Medication[];
};

function MedicationCalendar({ medications }: MedicationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );

  const medicationsWithDates = medications.map((medication) => {
    return {
      id: medication.id,
      date: new Date(medication.dateTaken),
      timeTaken: format(new Date(medication.dateTaken), "hh:mm a"),
      name: medication.name,
    };
  });

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
