import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export type Medication = {
  action: string;
  id: number;
  medicationId: number | "";
  name: string;
  dose?: number;
  doseUnit?: string;
  logTime?: string;
  date: Date;
  time: string;
};

const schema = yup.object().shape({
  medicationId: yup.string().required(),
  date: yup.date().required(),
  time: yup.string().required(),
});

interface MedicationFormProps {
  onSubmit: (data: Medication) => void;
  defaultValues?: Medication;
}

export const MedicationForm = ({ onSubmit, defaultValues }: MedicationFormProps) => {
  const [availableMedication, setAvailableMedication] = useState<Medication[]>(
    []
  );

  const [showAddNewMedicine, setShowAddNewMedicine] = useState(false);

  const [isNewMedication, setIsNewMedication] = useState(false);

  const toggleAddNewMedicine = () => {
    setShowAddNewMedicine(!showAddNewMedicine);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Medication>({
    resolver: yupResolver(schema),
    defaultValues,
  });

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
    onSubmit(data);
  };

  useEffect(() => {
    getAvailableMedication();
    reset(defaultValues);
  }, [reset, defaultValues]);

  const handleMedicationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "add_new") {
      toggleAddNewMedicine();
      setIsNewMedication(true);
    } else {
      const selectedMedication = availableMedication.find(
        (medication) => medication.id === parseInt(value)
      );
      reset({ ...defaultValues, medicationId: selectedMedication?.id });
      setIsNewMedication(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {showAddNewMedicine ? (
        <>
          <label className="text-base font-medium text-gray-900">
            Medication Name:
            <input
              type="text"
              className="ml-2 text-base font-normal text-gray-900"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
          <label className="text-base font-medium text-gray-900">
            Dose:
            <input
              type="number"
              className="ml-2 text-base font-normal text-gray-900"
              {...register("dose", { required: true })}
            />
            {errors.dose && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
          <label className="text-base font-medium text-gray-900">
            Dose Unit:
            <input
              type="text"
              className="ml-2 text-base font-normal text-gray-900"
              {...register("doseUnit", { required: true })}
            />
            {errors.doseUnit && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
          <label className="text-base font-medium text-gray-900">
            Log Time:
            <input
              type="time"
              className="ml-2 text-base font-normal text-gray-900"
              {...register("logTime", { required: true })}
            />
            {errors.logTime && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 rounded"
            onClick={toggleAddNewMedicine}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <label className="text-base font-medium text-gray-900">
            Medication:
            <select
              {...register("medicationId")}
              className="ml-2 text-base font-normal text-gray-900"
              onChange={handleMedicationChange}
            >
              <option disabled>Find or add medicine</option>
              <option value="add_new">+ Add new medicine</option>
              {availableMedication.map((medication) => (
                <option
                  key={medication.id}
                  value={medication.id}
                  selected={defaultValues?.medicationId === medication.id}
                >
                  {medication.name}
                </option>
              ))}
            </select>
            {errors.medicationId && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
          <label className="text-base font-medium text-gray-900">
            Date Taken:
            <input
              type="date"
              className="ml-2 text-base font-normal text-gray-900"
              {...register("date", { required: true })}
            />
            {errors.date && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
          <label className="text-base font-medium text-gray-900">
            Time Taken:
            <input
              type="time"
              className="ml-2 text-base font-normal text-gray-900"
              {...register("time", { required: true })}
            />
            {errors.time && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
        </>
      )}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
      >
        {isNewMedication ? "Save" : "Log"}
      </button>
    </form>
  );
};
