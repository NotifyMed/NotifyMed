import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LogMedicationForm } from "../components/medication/LogMedicationForm";
import { Medication } from "@/types/medicationTypes";
import axios from "axios";
import { splitDateTime } from ".././utils/splitDateTimeUtility";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { CSVLink } from "react-csv";

function MedicationSchedule() {
  const { data: session, status } = useSession({ required: true });
  const [userMedications, setUserMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogMedication = (medication: Medication) => {
    setMedicationLogs([...medicationLogs, medication]);
  };

  useEffect(() => {
    const getUserMedicationLogs = async () => {
      try {
        const medicationResponse = await axios.get("/api/medication");
        const medicationData = medicationResponse.data;
        setUserMedications(medicationData);

        const logResponse = await axios.get(
          "/api/medication?action=GET_MEDICATION_LOG"
        );
        const logData = logResponse.data;
        setMedicationLogs(logData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setLoading(false);
      }
    };

    getUserMedicationLogs();
  }, []);

  const prepareCsvData = () => {
    const csvData = userMedications.map((medication) => {
      const logs = medicationLogs.find((log) => log.id === medication.id);
      return {
        Medication: capitalizeFirstLetter(medication.name),
        "Date Taken": logs ? splitDateTime(logs.dateTaken).formattedDate : "",
        "Time Taken": logs ? splitDateTime(logs.dateTaken).formattedTime : "",
      };
    });

    return csvData;
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
      {status === "authenticated" && (
        <section
          id="medication-schedule"
          className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 animate-fade-in-up min-h-screen"
        >
          <div className="flex flex-col md:flex-row space-x-4 ">
            <div className="w-full md:w-1/2 mt-4">
              <LogMedicationForm logMedication={handleLogMedication} />
            </div>

            <div className="w-full md:w-1/2">
              {loading ? (
                <p>Loading medications...</p>
              ) : (
                <>
                  <p className="text-xl font-semibold text-center mb-4">
                    {` ${session?.user?.name}'s Medication Logs`}
                  </p>
                  {userMedications.length > 0 ? (
                    <table className=" w-full border border-gray-300">
                      <thead>
                        <tr>
                          <th className="p-2 font-medium">Medication</th>
                          <th className="p-2 font-medium">Date Taken</th>
                          <th className="p-2 font-medium">Time taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userMedications.map((medication) => {
                          const logs = medicationLogs.find(
                            (log) => log.id === medication.id
                          );
                          return (
                            logs && (
                              <tr
                                key={medication.name}
                                className="border-t border-gray-300 text-center"
                              >
                                <td className="p-3">
                                  {capitalizeFirstLetter(medication.name)}
                                </td>
                                <td className="p-3">
                                  {splitDateTime(logs.dateTaken).formattedDate}
                                </td>
                                <td className="p-3">
                                  {splitDateTime(logs.dateTaken).formattedTime}
                                </td>
                              </tr>
                            )
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="mt-4">No medications found</p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <CSVLink
              data={prepareCsvData()}
              filename="medicationlogs.csv"
              className="py-2 px-4 text-white hover:text-black font-semibold rounded-md shadow hover:bg-white border border-white"
            >
              Export CSV
            </CSVLink>
          </div>
        </section>
      )}
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
