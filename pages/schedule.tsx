import { useEffect, useRef, useState } from "react";
import Head from "next/head";

import { RiMedicineBottleLine } from "react-icons/ri";

import MedicationCalendar, {
  Medication,
} from "@/components/calendar/MedicationCalendar";
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
      if (event.target === overlayRef.current) {
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

  const handleAddMedication = (medication: Medication) => {
    setMedications([...medications, { ...medication }]);
    closeDialog();
  };

  const handleEditMedication = (medication: Medication) => {
    setMedications((prevMedications) =>
      prevMedications.map((prevMedication) =>
        prevMedication.name === medication.name
          ? { ...prevMedication, date: medication.date, time: medication.time }
          : prevMedication
      )
    );
  };

  const handleDeleteMedication = (medication: Medication) => {
    setMedications((prevMedications) =>
      prevMedications.filter((prevMedication) => {
        return (
          prevMedication.name === medication.name &&
          prevMedication.date.getTime() === medication.date.getTime() &&
          prevMedication.time === medication.time
        );
      })
    );
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
          mode="add"
        />
      </section>
    </>
  );
}

export default MedicationSchedule;
