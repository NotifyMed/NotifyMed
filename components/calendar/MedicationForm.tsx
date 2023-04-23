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

export const MedicationForm = ({
  addMedication,
}: {
  addMedication: (medication: Medication) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Medication>({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (data: Medication) => {
    addMedication(data);
    console.log(`${data.name} ${data.time}`);
  };

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
