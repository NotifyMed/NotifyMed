import { GetServerSidePropsContext } from "next";
import { useSession, signOut, getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Medication } from "@/components/medication/MedicationForm";
import axios from "axios";

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Account() {
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
        <div>
          <p>Welcome back {session?.user?.name}!</p>
          {loading ? (
            <p>Loading medications...</p>
          ) : (
            <>
              {medications.length > 0 ? (
                <ul>
                  {medications.map((medication) => (
                    <li key={medication.name}>
                      {capitalizeFirstLetter(medication.name)} -{" "}
                      {medication.dose} {medication.doseUnit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No medications found</p>
              )}
            </>
          )}
          <Image
            src={session?.user?.image ?? ""}
            alt={`${session?.user?.name}'s profile picture`}
            height={100}
            width={100}
            className="rounded-full border-4 border-blue-500"
          />
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
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
