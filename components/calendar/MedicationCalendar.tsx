import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { BsPencil, BsTrash } from "react-icons/bs";

import { MonthlyNav } from "./MonthlyNav";
import { Medication } from "../medication/LogMedicationForm";

import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
} from "@zach.codes/react-calendar";

interface MedicationInfoProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

function MedicationInfo({ medication, onEdit, onDelete }: MedicationInfoProps) {
  const formattedTime = format(
    new Date(`01/01/2000 ${medication.time}`),
    "h:mma"
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    onEdit(medication);
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
    onDelete(medication);
  };

  return (
    <>
      <div>
        <div className="flex justify-evenly">
          <p>{medication.name}</p>
          <p>{formattedTime}</p>
          <BsPencil onClick={handleEditClick} />
          <BsTrash onClick={handleDeleteClick} />
        </div>
      </div>
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
      .map(({ time, ...medication }) => ({
        ...medication,
        date: new Date(`${medication.date?.toDateString()} ${time}`),
        time: time.replace(/:\d{2}(\D*)$/, "$1"),
      }))
      .sort(
        (a, b) =>
          Number(a.date) - Number(b.date) || a.time.localeCompare(b.time)
      ) || [];

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
        <div className="flex flex-col">
          <MonthlyNav />
          <div className="border-b-2 border-t-2 border-l-2 border-r-2 text-base font-normal text-gray-900">
            <MonthlyBody events={medicationsWithDates}>
              <MonthlyDay<Medication>
                renderDay={(data) =>
                  data.map((medication) => (
                    <MedicationInfo
                      key={medication.id}
                      medication={medication}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                }
              />
            </MonthlyBody>
          </div>
        </div>
      </MonthlyCalendar>
    </>
  );
}

export default MedicationCalendar;
