import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import axios from "axios";

import { RiMedicineBottleLine } from "react-icons/ri";
import { Medication } from "@/components/medication/MedicationForm";

import MedicationCalendar from "@/components/calendar/MedicationCalendar";
import { MedicationFormDialog } from "@/components/medication/MedicationFormDialog";

function MedicationSchedule() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  useEffect(() => {
    const handleOverlayClick = (event: MouseEvent) => {
      const dialog = document.querySelector(".dialog-container");
      if (dialog && !dialog.contains(event.target as Node)) {
        closeDialog();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleOverlayClick);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleOverlayClick);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [open]);

  const handleAddMedication = async (medication: Medication) => {
    try {
      const response = await axios.post("/api/medication", {
        action: "ADD_MEDICATION",
        name: medication.name,
        dose: medication.dose,
        doseUnit: medication.doseUnit,
      });
      if (response.status === 200) {
        setMedications([...medications, response.data]);
        closeDialog();
      }
    } catch (error) {
      console.error("Failed to add medication:", error);
    }
  };

  const handleEditMedication = async (medication: Medication) => {
    try {
      const response = await axios.patch(`/api/medication/${medication.id}`, {
        action: "EDIT_MEDICATION",
        id: medication.id,
        name: medication.name,
      });
      if (response.status === 200) {
        setMedications((prevMedications) =>
          prevMedications.map((prevMedication) =>
            prevMedication.id === medication.id ? response.data : prevMedication
          )
        );
      }
    } catch (error) {
      console.error("Failed to edit medication:", error);
    }
  };

  const handleDeleteMedication = async (medication: Medication) => {
    try {
      const response = await axios.delete(`/api/medication/${medication.id}`);
      if (response.status === 200) {
        setMedications((prevMedications) =>
          prevMedications.filter(
            (prevMedication) => prevMedication.id !== medication.id
          )
        );
      }
    } catch (error) {
      console.error("Failed to delete medication:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Medication Schedule | NotifyMed</title>
        <link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />
        <meta name="theme-color" content="#30527D" />
        <meta name="description" content="medication schedule at NotifyMed" />
        <meta name="keywords" content="medication schedule, notifymed" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <section
        id="medication-schedule"
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 animate-fade-in-up min-h-screen"
      >
        <h1 className="mt-5 text-4xl font-medium text-center">
          Medication Schedule
        </h1>
        <button
          className="my-5  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={openDialog}
        >
          <span>Add Medication</span>
          <RiMedicineBottleLine className="ml-2 h-5 w-5" />
        </button>

        <MedicationCalendar
          medications={medications}
          onEdit={handleEditMedication}
          onDelete={handleDeleteMedication}
        />
        {open && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"
            ref={overlayRef}
          />
        )}
        <MedicationFormDialog
          isOpen={open}
          onClose={closeDialog}
          onSubmit={handleAddMedication}
        />
      </section>
    </>
  );
}

export default MedicationSchedule;
