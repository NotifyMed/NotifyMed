export type LoggedMedication = {
  medicationId: number;
  userID?: number;
  name: string;
  dateTaken: Date;
  timeTaken: string;
};

export type NewMedication = {
  id?: number;
  name: string;
  dose: number;
  doseUnit: string;
};

export type Medication = {
  action?: string;
  medication_id: number;
  id?: number;
  userID?: number;
  name: string;
  dose: number;
  doseUnit: string;
  dateTaken: Date;
  timeTaken: string;
  logWindowStart?: string;
  logWindowEnd?: string;
  logFrequency?: string;
};

export type MedicationSchedule = {
  medication: Medication;
  logWindowStart: string;
  logWindowEnd: string;
  logFrequency: string;
};
