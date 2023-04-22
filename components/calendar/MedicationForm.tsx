import { useState } from "react";

interface Medication {
  name: string;
  date: Date;
  time: string;
}

export const MedicationForm = ({
  addMedication,
}: {
  addMedication: (medication: Medication) => void;
}) => {
  const [medicationName, setMedicationName] = useState("");
  const [medicationDate, setMedicationDate] = useState("");
  const [medicationTime, setMedicationTime] = useState("");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const medication = {
      name: medicationName,
      date: new Date(medicationDate), // Convert the string date to a Date object
      time: medicationTime,
    };
    addMedication(medication);
    console.log(`${medicationName} ${medicationTime}`);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Medication:
        <input
          type="text"
          value={medicationName}
          onChange={(event) => setMedicationName(event.target.value)}
        />
      </label>
      <br />
      <label>
        Date Taken:
        <input
          type="date"
          value={medicationDate}
          onChange={(event) => setMedicationDate(event.target.value)}
        />
      </label>
      <br />
      <label>
        Time Taken:
        <input
          type="time"
          value={medicationTime}
          onChange={(event) => setMedicationTime(event.target.value)}
        />
      </label>
      <br />
      <br />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Log Medication
      </button>
    </form>
  );
};
