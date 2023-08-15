import axios from "axios";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NewMedication, MedicationSchedule } from "@/types/medicationTypes";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  dose: yup.string().required("Dose is required"),
  doseUnit: yup.string().required("Dose Unit is required"),
  logWindowStart: yup.string().required("Log Window Start is required"),
  logWindowEnd: yup.string().required("Log Window End is required"),
  logFrequency: yup.string().required("Log Window End is required"),
});

const doseUnits = ["g", "mg", "ml", "l", "tbsp", "tsp", "capsule"];

const AddNewMedicationForm = ({
  handleAddNewMedication,
  toggleAddNewMedicine,
}: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //@ts-ignore
    resolver: yupResolver(schema),
    defaultValues:
      process.env.NODE_ENV === "development"
        ? {
            name: "Advil",
            dose: "10",
            doseUnit: "mg",
            logWindowStart: "12:00:00",
            logWindowEnd: "12:00:00",
            logFrequency: "24",
          }
        : {},
  });

  const onSubmit = async (data: any) => {
    const doseValue = parseFloat(data.dose);

    const newMedication: NewMedication = {
      name: data.name,
      dose: doseValue,
      doseUnit: data.doseUnit,
    };

    const medicationSchedule: MedicationSchedule = {
      medication: data.name,
      logWindowStart: data.logWindowStart,
      logWindowEnd: data.logWindowEnd,
      logFrequency: data.logFrequency,
    };

    try {
      const session = await getSession();
      if (!session) {
        console.error("User not logged in.");
        return;
      }

      const res = await axios.put("/api/medication", {
        action: "ADD_MEDICATION_WITH_SCHEDULE",
        userId: session?.user?.userId,
        medication: newMedication,
        logWindowStart: data.logWindowStart,
        logWindowEnd: data.logWindowEnd,
        logFrequency: data.logFrequency,
      });

      if (res.status === 200) {
        console.log(res);
        handleAddNewMedication({
          ...newMedication,
          ...medicationSchedule,
          id: res.data.medication.id,
          logWindowStart: res.data.schedule.logWindowStart,
          logWindowEnd: res.data.schedule.logWindowEnd,
          logFrequency: res.data.schedule.logFrequency,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2">
        <label htmlFor="Name">Name</label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        />
        <label htmlFor="Dose">Dose</label>
        <input
          type="text"
          id="dose"
          {...register("dose")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        />
        <label htmlFor="Dose Unit">Dose Unit</label>
        <select
          id="doseUnit"
          {...register("doseUnit")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        >
          {doseUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>

        <label htmlFor="Log Window (Start)">Log Window (Start)</label>
        <input
          type="time"
          id="logWindowStart"
          {...register("logWindowStart")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        />
        <label htmlFor="Log Window (End)">Log Window (End)</label>
        <input
          type="time"
          id="logWindowEnd"
          {...register("logWindowEnd")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        />
        <label htmlFor="Log Frequency (Hours)">Log Frequency (Hours)</label>
        <input
          type="number"
          id="frequency"
          {...register("logFrequency")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="text-teal-600 hover:text-white py-2 px-4 mb-4 rounded"
            onClick={toggleAddNewMedicine}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 mb-4 rounded"
          >
            Save Medicine
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddNewMedicationForm;
