import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { BsPencil, BsTrash } from "react-icons/bs";

import { MonthlyNav } from "./MonthlyNav";
import { MedicationFormDialog } from "../medication/MedicationFormDialog";

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

interface MedicationInfoProps extends Medication {
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

function MedicationInfo({
  name,
  date,
  time,
  windowStart,
  windowEnd,
  notificationsEnabled,
  onEdit,
  onDelete,
}: MedicationInfoProps) {
  const formattedTime = format(new Date(`01/01/2000 ${time}`), "h:mma");

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
  };

  const handleEditSubmit = (medication: Medication) => {
    console.log("Updating medication list with edited medication:", medication);
    onEdit(medication);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete({ name, date, time });
  };

  return (
    <>
      <div>
        <div className="flex justify-evenly">
          <p>{name}</p>
          <p>{formattedTime}</p>
          <BsPencil onClick={handleEditClick} />
          <BsTrash onClick={handleDeleteClick} />
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
      {isEditing && (
        <MedicationFormDialog
          isOpen={isEditing}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
          mode="edit"
          medication={{ name, date, time }}
          date={date}
        />
      )}
    </>
  );
}

type MedicationCalendarProps = {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
};

function MedicationCalendar({
  medications,
  onEdit,
  onDelete,
}: MedicationCalendarProps) {
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

  const handleEdit = (medication: Medication) => {
    onEdit(medication);
  };

  const handleDelete = (medication: Medication) => {
    onDelete(medication);
  };

  return (
    <>
      <MonthlyCalendar
        currentMonth={currentMonth}
        onCurrentMonthChange={(date) => setCurrentMonth(date)}
      >
        <MonthlyNav />
        <div className="border-b-2 border-t-2 border-l-2 border-r-2 text-base font-normal text-gray-900">
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
