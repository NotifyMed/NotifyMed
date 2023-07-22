import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

import { useEffect, useState } from "react";
import Head from "next/head";

import {
  Medication,
  MedicationForm,
} from "@/components/medication/LogMedicationForm";

import MedicationCalendar from "@/components/calendar/MedicationCalendar";

function MedicationSchedule() {
  const [medications, setMedications] = useState<Medication[]>([]);

  const handleLogMedication = (medication: Medication) => {
    setMedications([
      ...medications,
      { ...medication, logWindowStart: "", logWindowEnd: "" },
    ]);
  };
  const handleEditMedication = (medication: Medication) => {
    setMedications((prevMedications) =>
      prevMedications.map((prevMedication) =>
        prevMedication.name === medication.name
          ? {
              ...prevMedication,
              date: medication.dateTaken,
              time: medication.dateTaken,
            }
          : prevMedication
      )
    );
  };

  const handleDeleteMedication = (medication: Medication) => {
    setMedications((prevMedications) =>
      prevMedications.filter((prevMedication) => {
        return (
          prevMedication.name === medication.name &&
          prevMedication?.dateTaken?.getTime() ===
            medication?.dateTaken?.getTime() &&
          prevMedication.dateTaken === medication.dateTaken
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
        <h1 className="mt-5 text-4xl font-medium text-center sr-only">
          Medication Schedule
        </h1>
        <div className="flex flex-col md:flex-row space-x-4">
          <div className="w-full md:w-5/12">
            <MedicationForm onSubmit={handleLogMedication} />
          </div>
          <div className="w-full md:w-7/12">
            <MedicationCalendar
              medications={medications}
              onEdit={handleEditMedication}
              onDelete={handleDeleteMedication}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default MedicationSchedule;



export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login?previous=schedule",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
