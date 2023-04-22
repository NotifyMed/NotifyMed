import { useState, useRef, useEffect } from "react";
import Head from "next/head";

import { Dialog } from "@headlessui/react";
import { HiX } from "react-icons/hi";
import { RiMedicineBottleLine } from "react-icons/ri";

import MedicationCalendar, {
  Medication,
} from "../components/calendar/MedicationCalendar";
import { MedicationForm } from "@/components/calendar/MedicationForm";

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
      document.addEventListener("mousedown", handleOverlayClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [open]);

  const handleAddMedication = (medication: Medication) => {
    setMedications([...medications, medication]);
    closeDialog();
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

        <MedicationCalendar medications={medications} />
        <Dialog
          open={open}
          onClose={closeDialog}
          static={false}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div
            className="flex items-center justify-center min-h-screen"
            ref={overlayRef}
          >
            <div className="bg-white rounded-lg shadow-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Add Medication
                </Dialog.Title>
                <button onClick={closeDialog}>
                  <HiX className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <MedicationForm addMedication={handleAddMedication} />
            </div>
          </div>
        </Dialog>
      </section>
    </>
  );
}

export default MedicationSchedule;
