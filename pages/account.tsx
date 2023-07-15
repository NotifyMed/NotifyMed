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
  const [userData, setUserData] = useState({
    phone: "",
    isEditingPhone: false,
  });
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const { phone, isEditingPhone } = userData;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevData) => ({
      ...prevData,
      phone: e.target.value,
    }));
  };

  const handlePhoneSubmit = async () => {
    try {
      await axios.put("/api/user", { email: session?.user?.email, phone });
      console.log("Phone number saved successfully");
      setShowOptionsMenu(false);
      sessionStorage.setItem("phone", phone);
      setUserData((prevData) => ({
        ...prevData,
        isEditingPhone: false,
      }));
    } catch (error) {
      console.error("Error saving phone number:", error);
    }
  };

  const handleEditPhone = () => {
    setShowOptionsMenu(false);
    setUserData((prevData) => ({
      ...prevData,
      isEditingPhone: true,
    }));
  };

  const handleCancelEditPhone = () => {
    setShowOptionsMenu(false);
    setUserData((prevData) => ({
      ...prevData,
      phone: sessionStorage.getItem("phone") || "",
      isEditingPhone: false,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePhoneSubmit();
    }
  };

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

    const fetchUserPhone = async () => {
      try {
        const storedPhone = sessionStorage.getItem("phone");
        if (storedPhone) {
          setUserData((prevData) => ({
            ...prevData,
            phone: storedPhone,
          }));
        } else {
          const response = await axios.get("/api/user");
          const [user] = response.data;
          setUserData((prevData) => ({
            ...prevData,
            phone: user?.phone || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user phone number:", error);
      }
    };

    getUserMedications();
    fetchUserPhone();
  }, []);

  return (
    <>
      {status === "authenticated" && (
        <section className="flex flex-col items-center justify-center min-h-screen">
          <p>Welcome back {session?.user?.name}!</p>
          <div className="flex items-center">
            <p className="mr-2">Phone Number:</p>
            <input
              className="text-white bg-black mr-2"
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyDown}
              readOnly={!isEditingPhone}
              style={{
                userSelect: isEditingPhone ? "text" : "none",
              }}
            />
            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="ml-1"
              >
                &#8942;
              </button>
              {showOptionsMenu && (
                <div className="absolute top-full left-0 bg-white p-2 rounded border border-gray-300">
                  {!isEditingPhone && (
                    <button
                      onClick={handleEditPhone}
                      className="text-black p-2 block w-full text-left"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={handleCancelEditPhone}
                    className="text-black p-2 block w-full text-left"
                  >
                    Cancel
                  </button>

                  {isEditingPhone && (
                    <button
                      onClick={handlePhoneSubmit}
                      className="bg-white text-black p-2 block w-full text-left"
                    >
                      Save
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <Image
            src={session?.user?.image ?? ""}
            alt={`${session?.user?.name}'s profile picture`}
            height={100}
            width={100}
            className="rounded-full border-4 border-blue-500"
          />
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
          <button onClick={() => signOut()}>Sign Out</button>
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
