import { GetServerSidePropsContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Medication } from "@/components/medication/MedicationForm";
import axios from "axios";

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Dashboard() {
  const { data: session, status } = useSession({ required: true });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserMedications = async () => {
      try {
        const response = await axios.get("/api/medication");
        const data = response.data;
        setMedications(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setLoading(false);
      }
    };

    getUserMedications();
  }, []);

  return (
    <>
      {status === "authenticated" && (
        <section className="flex flex-col items-center justify-center min-h-screen">
          <p>Welcome back {session?.user?.name}!</p>

          {loading ? (
            <p>Loading medications...</p>
          ) : (
            <>
              {medications.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dose</th>
                      <th>Dose Unit</th>
                      <th>Log Window: (Start)</th>
                      <th>Log Window: (End)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((medication) => (
                      <tr key={medication.name}>
                        <td>{capitalizeFirstLetter(medication.name)}</td>
                        <td>{medication.dose}</td>
                        <td>{medication.doseUnit}</td>
                        <td>{medication.logWindowStart}</td>
                        <td>{medication.logWindowEnd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No medications found</p>
              )}
            </>
          )}
        </section>
      )}
      {status !== "authenticated" && (
        <div>
          <p>You are not signed in</p>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
