import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import MedicationCalendar from "../components/calendar/MedicationCalendar";
import { LogMedicationForm } from "../components/medication/LogMedicationForm";
import { LoggedMedication } from "@/types/medicationTypes";

function MedicationSchedule() {
  const [medications, setMedications] = useState<LoggedMedication[]>([]);
  const handleLogMedication = (medication: LoggedMedication) => {
    setMedications([...medications, medication]);
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
        <div className="flex flex-col md:flex-row space-x-4">
          <div className="w-full md:w-5/12">
            <LogMedicationForm logMedication={handleLogMedication} />
          </div>
          <div className="w-full md:w-7/12">
            <MedicationCalendar medications={medications} />
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
