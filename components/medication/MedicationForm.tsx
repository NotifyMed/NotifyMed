import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Medication {
  id: number;
  medicationId: number;
  name: string;
  action: string;
  date: Date;
  time: string;
}

const schema = yup.object().shape({
  medicationId: yup.string().required(),
  date: yup.date().required(),
  time: yup.string().required(),
});

interface MedicationFormProps {
  onSubmit: (data: Medication, mode: "log" | "edit") => void;
  defaultValues?: Medication;
  mode: "log" | "edit";
}

export const MedicationForm = ({
  onSubmit,
  defaultValues,
  mode,
}: MedicationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Medication>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [availableMedication, setAvailableMedication] = useState<Medication[]>(
    []
  );

  const getAvailableMedication = async () => {
    const response = await fetch("/api/medication", {
      method: "GET",
    });
    const data = await response.json();
    setAvailableMedication(data);
  };

  const saveMedicationToDatabase = async (data: Medication) => {
    const response = fetch("/api/medication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const handleFormSubmit = async (data: Medication) => {
    await saveMedicationToDatabase({ ...data, action: "ADD_MEDICATION_LOG" });
    onSubmit(data, mode);
  };

  useEffect(() => {
    getAvailableMedication();
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label className="text-base font-medium text-gray-900">
        Medication:
        <select
          {...register("medicationId")}
          className="ml-2 text-base font-normal text-gray-900"
        >
          {availableMedication.map((medication) => (
            <option key={medication.id} value={medication.id}>
              {medication.name}
            </option>
          ))}
        </select>
        {errors.name && <span className="block">This field is required</span>}
      </label>
      <br />
      <label className="text-base font-medium text-gray-900">
        Date Taken:
        <input
          type="date"
          className="ml-2 text-base font-normal text-gray-900"
          {...register("date")}
        />
        {errors.date && <span className="block">This field is required</span>}
      </label>
      <br />
      <label className="text-base font-medium text-gray-900">
        Time Taken:
        <input
          type="time"
          className="ml-2 text-base font-normal text-gray-900"
          {...register("time")}
        />
        {errors.time && <span className="block">This field is required</span>}
      </label>
      <br />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
      >
        {mode === "log" ? <span>Log Medication </span> : <span>Update</span>}
      </button>
    </form>
  );
};
