import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import Head from "next/head";
import { LogMedicationForm } from "../components/medication/LogMedicationForm";
import MedicationCalendar from "@/components/calendar/MedicationCalendar";
import { NextSeo } from "next-seo";

const fetcher = async (url: string, ...args: any[]) => {
  const response = await fetch(url, ...args);
  return response.json();
};

function MedicationSchedule() {
  const { data: session, status } = useSession({ required: true });
  const { data: medicationLogs, error: logError } = useSWR(
    "/api/medication?action=GET_MEDICATION_LOG",
    fetcher
  );
  const handleLogMedication = async () => {
    try {
      await mutate("/api/medication?action=GET_MEDICATION_LOG");
    } catch (error) {
      console.error("Error logging medication:", error);
    }
  };

  return (
    <div className="bg-gray-dark">
      <NextSeo
        title="Medication Schedule | Notify Med"
        description="Medication Schedule for Notify Med"
        canonical="https://notifymed.com/schedule"
        openGraph={{
          url: "https://notifymed.com/schedule",
          title: "Medication Schedule | Notify Med",
          description: "Medication Schedule for Notify Med",
          site_name: "Notify Med",
          type: "website",
          locale: "en_US",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "medication, reminder, tracker,",
          },
          {
            name: "author",
            content: "Notify Med",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:locale",
            content: "en_US",
          },
          {
            property: "og:site_name",
            content: "Notify Med",
          },
        ]}
      />
      {status === "authenticated" && (
        <section
          id="medication-schedule"
          className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 animate-fade-in-up min-h-screen"
        >
          <div className="flex flex-col md:flex-row space-x-4 ">
            <div className="w-full md:w-5/12">
              <LogMedicationForm logMedication={handleLogMedication} />
            </div>
            <div className="w-full md:w-7/12">
              {medicationLogs && !logError && (
                <MedicationCalendar medications={medicationLogs} />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
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
