import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Medication {
  name: string;
  date: Date;
  time: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  date: yup.date().required(),
  time: yup.string().required(),
});

interface Props {
  onSubmit: (data: Medication, mode: "add" | "edit") => void;
  defaultValues?: Medication;
  mode: "add" | "edit";
}

export const MedicationForm = ({ onSubmit, defaultValues, mode }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Medication>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleFormSubmit = (data: Medication) => {
    onSubmit(data, mode);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label>
        Medication:
        <input type="text" {...register("name")} />
        {errors.name && <span className="block">This field is required</span>}
      </label>
      <br />
      <label>
        Date Taken:
        <input type="date" {...register("date")} />
        {errors.date && <span className="block">This field is required</span>}
      </label>
      <br />
      <label>
        Time Taken:
        <input type="time" {...register("time")} />
        {errors.time && <span className="block">This field is required</span>}
      </label>
      <br />
      <button type="submit">
        {mode === "add" ? (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log Medication
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        )}
      </button>
    </form>
  );
};
