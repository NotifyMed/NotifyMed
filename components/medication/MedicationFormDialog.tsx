import { Dialog } from "@headlessui/react";
import { HiX } from "react-icons/hi";

import { Medication } from "../medication/MedicationForm";
import { MedicationForm } from "./MedicationForm";

interface MedicationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medication: Medication) => void;
  medication?: Medication;
  date?: Date;
}

export function MedicationFormDialog({
  isOpen,
  onClose,
  onSubmit,
  medication,
}: MedicationFormDialogProps) {
  const handleFormSubmit = (data: Medication) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      static={false}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-4 dialog-container">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Medication
            </Dialog.Title>
            <button onClick={onClose}>
              <HiX className="h-5 w-5 text-gray-400 hover:text-gray-800" />
            </button>
          </div>
          <MedicationForm
            onSubmit={handleFormSubmit}
            defaultValues={medication}
          />
        </div>
      </div>
    </Dialog>
  );
}
