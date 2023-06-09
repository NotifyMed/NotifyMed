import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Combobox, Transition } from "@headlessui/react";
import { HiOutlineCheck } from "react-icons/hi";

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

export const MedicationForm = ({
  onSubmit,
  defaultValues,
}: MedicationFormProps) => {
  const [availableMedication, setAvailableMedication] = useState<Medication[]>(
    []
  );

  const [showAddNewMedicine, setShowAddNewMedicine] = useState(false);
  const [isNewMedication, setIsNewMedication] = useState(false);
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

  const handleMedicationChange = (value: Medication | string) => {
    if (value === "add_new") {
      toggleAddNewMedicine();
      setIsNewMedication(true);
    } else {
      const selectedMedication = availableMedication.find(
        (medication) => medication.id
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
            <Combobox>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    placeholder="Find or add new medicine"
                    displayValue={(medication: Medication) => medication.name}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <Combobox.Option
                      className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900"
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
