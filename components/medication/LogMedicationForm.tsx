import { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Combobox, Transition } from "@headlessui/react";
import { HiOutlineCheck } from "react-icons/hi";
import axios from "axios";
import AddNewMedicationForm from "./AddNewMedicationForm";

export type NewMedication = {
  id?: number;
  name: string;
  dose: number;
  doseUnit: string;
};

export type Medication = {
  action?: string;
  id?: number;
  userID?: number;
  name: string;
  dose: number;
  doseUnit: string;
  dateTaken?: Date;
  timeTaken?: string;
  logWindowStart?: string;
  logWindowEnd?: string;
};

export type MedicationSchedule = {
  medication: Medication;
  logWindowStart: string;
  logWindowEnd: string;
  dateTaken?: Date;
  timeTaken?: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Medication name is required"),
  dateTaken: yup.date().required("The date and time is required"),
  time: yup.string().required("The date and time is required"),
  dose: yup
    .number()
    .required("Dose is required")
    .positive("Dose must be positive"),
  doseUnit: yup.string().required("Dose Unit is required"),
  logWindowStart: yup
    .string()
    .required("The start of your log window is required"),
  logWindowEnd: yup.string().required("The end of your log window is required"),
});

interface MedicationFormProps {
  onSubmit: (data: Medication) => void;
  defaultValues?: Medication;
}

export const MedicationForm = ({
  onSubmit,
  defaultValues,
}: MedicationFormProps) => {
  const [availableMedication, setAvailableMedication] = useState<Medication[]>(
    []
  );
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [showAddNewMedicine, setShowAddNewMedicine] = useState(false);
  const [query, setQuery] = useState("");

  const filteredMedications =
    query === ""
      ? availableMedication
      : availableMedication.filter((medication) =>
          medication.name.toLowerCase().includes(query.toLowerCase())
        );

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
    try {
      const response = await axios.get("/api/medication");
      const data = response.data;
      console.log(data);
      setAvailableMedication(data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveMedicationToDatabase = async (data: Medication) => {
    try {
      const response = await axios.post("/api/medication", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleFormSubmit = async (data: Medication) => {
    await saveMedicationToDatabase({ ...data, action: "ADD_MEDICATION_LOG" });
    onSubmit(data);
  };

  // console.log(session)

  async function handleAddNewMedication(newMedication: NewMedication) {
    try {
      const response = await axios.get("/api/medication");
      const data = response.data;

      setAvailableMedication(data);

      const newlyAddedMedication = data.find(
        (el: Medication) => el.id == newMedication.id
      );
      setSelectedMedication(newlyAddedMedication);
    } catch (error) {
      console.error(error);
    }

    setShowAddNewMedicine(false);
  }

  useEffect(() => {
    getAvailableMedication();
    reset(defaultValues);
  }, [reset, defaultValues]);

  const handleMedicationChange = (value: Medication | string) => {
    if (value === "add_new") {
      toggleAddNewMedicine();
      setShowAddNewMedicine(true);
    } else {
      const selectedMedication = availableMedication.find(
        (medication) => medication.name
      );
      reset({ ...defaultValues, name: selectedMedication?.name });
      setShowAddNewMedicine(false);
    }
  };

  return (
    <div>
      {showAddNewMedicine && (
        <AddNewMedicationForm
          handleAddNewMedication={handleAddNewMedication}
          toggleAddNewMedicine={toggleAddNewMedicine}
        />
      )}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col space-y-5">
          <label className="text-base font-medium text-white ">
            Medication:
            <Combobox
              value={selectedMedication}
              onChange={setSelectedMedication}
            >
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900  focus:ring-0"
                    placeholder="Find or add new medicine"
                    displayValue={(medication: Medication) =>
                      medication ? medication.name : ""
                    }
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                      color="black"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      />
                    </svg>
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery("")}
                >
                  <Combobox.Options className="absolute mt-1 max-h-64 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <Combobox.Option
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-teal-600 text-white" : "text-gray-900"
                        }`
                      }
                      value="add_new"
                    >
                      {({ active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              active ? "font-medium" : "font-normal"
                            }`}
                            onClick={() => handleMedicationChange("add_new")}
                          >
                            + Add new medicine
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                    {filteredMedications.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredMedications.map((medication) => (
                        <Combobox.Option
                          key={medication.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-teal-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={medication}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {medication.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-teal-600"
                                  }`}
                                >
                                  <HiOutlineCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </label>
          <label className="text-base font-medium text-white">
            Date Taken:
            <input
              type="date"
              className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
              {...register("dateTaken", { required: true })}
            />
            {errors.dateTaken && (
              <span className="block">This field is required</span>
            )}
          </label>
          <label className="text-base font-medium text-white">
            Time Taken:
            <input
              type="time"
              className="ml-2 text-base font-normal text-gray-900 w-1/2 p-1 rounded-lg"
              {...register("timeTaken", { required: true })}
            />
            {errors.timeTaken && (
              <span className="block">This field is required</span>
            )}
          </label>
          <br />
        </div>
        <div className="flex justify-end">
          <div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 mb-4 rounded"
            >
              Log Medicine
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
