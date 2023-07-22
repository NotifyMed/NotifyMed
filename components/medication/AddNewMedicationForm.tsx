import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { NewMedication } from "./LogMedicationForm";

type AddNewMedicationFormProps = {
  handleAddNewMedication: () => void;
  toggleAddNewMedicine: () => void;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  dose: yup
    .number()
    .required("Dose is required")
    .positive("Dose must be positive"),
  doseUnit: yup.string().required("Dose Unit is required"),
});

const AddNewMedicationForm = ({
  handleAddNewMedication,
  toggleAddNewMedicine,
}: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues:
      process.env.NODE_ENV === "development"
        ? {
            name: "Advil",
            dose: "10",
            doseUnit: "mg",
          }
        : {},
  });
  const onSubmit = async (data: any) => {
    const newMedication: NewMedication = {
      name: data.name,
      dose: data.dose,
      doseUnit: data.doseUnit,
    };

    const res = await axios.put("/api/medication", {
      action: "ADD_MEDICATION",
      medication: newMedication,
    });
    if (res.status == 200) {
      console.log(res);
      handleAddNewMedication({ ...newMedication, id: res.data[0].id });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-5">
        <label htmlFor="">Name</label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        />
        <label htmlFor="">Dose</label>
        <input
          type="text"
          id="dose"
          {...register("dose")}
          className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
        />
        <label htmlFor="">Dose Unit</label>
        <input
          type="text"
          id="doseUnit"
          {...register("doseUnit")}
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
