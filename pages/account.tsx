import { GetServerSidePropsContext } from "next";
import { useSession, getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, parse } from "date-fns";
import axios from "axios";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Medication } from "@/components/medication/LogMedicationForm";

type Profile = {
  phone: string;
};

interface AccountProps {
  defaultValues?: Profile;
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  phone: yup.string().matches(phoneRegExp, "Phone number is not valid"),
});

export default function Account({ defaultValues }: AccountProps) {
  const { data: session, status } = useSession({ required: true });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [userProfile, setUserProfile] = useState({
    phone: "",
    isEditingPhone: false,
  });

  const { phone, isEditingPhone } = userProfile;
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile((prevData) => ({
      ...prevData,
      phone: e.target.value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      await axios.patch("/api/user", { email: session?.user?.email, phone });
      console.log("Phone number saved successfully");
      setUserProfile((prevData) => ({
        ...prevData,
        isEditingPhone: false,
      }));
    } catch (error) {
      console.error("Error saving phone number:", error);
    }
  };

  const handleEditPhone = () => {
    setUserProfile((prevData) => ({
      ...prevData,
      isEditingPhone: true,
    }));
  };

  const handleCancelEditPhone = () => {
    setUserProfile((prevData) => ({
      ...prevData,
      isEditingPhone: false,
    }));
    setShowOptionsMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFormSubmit();
    }
  };

  const handleClickOutsideMenu = (e: MouseEvent) => {
    if (
      optionsMenuRef.current &&
      !optionsMenuRef.current.contains(e.target as Node)
    ) {
      setShowOptionsMenu(false);
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
        const response = await axios.get("/api/user", {
          params: { email: session?.user?.email },
        });
        const user = response.data;
        setUserProfile((prevData) => ({
          ...prevData,
          phone: user?.phone || "",
        }));
      } catch (error) {
        console.error("Error fetching user phone number:", error);
      }
    };

    getUserMedications();
    fetchUserPhone();

    document.addEventListener("click", handleClickOutsideMenu);

    return () => {
      document.removeEventListener("click", handleClickOutsideMenu);
    };
  }, [session]);

  return (
    <div className="bg-gray-dark">
      {status === "authenticated" && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 animate-fade-in-up min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">
            {phone
              ? `Welcome back, ${session?.user?.name}!`
              : `Welcome, ${session?.user?.name}!`}
          </p>
          {!phone && (
            <>
              <p className="text-lg">On time, every time.</p>
              <p className="text-md ">
                By providing your phone number, you will be able to start
                receiving text reminders.
              </p>
            </>
          )}
          <div className="flex items-center mt-4">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <label className="text-white font-medium">
                Phone Number:
                <input
                  className="ml-2 text-black bg-white p-2 border border-gray-300 rounded"
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  onKeyDown={handleKeyDown}
                  readOnly={!isEditingPhone}
                  style={{
                    userSelect: isEditingPhone ? "text" : "none",
                  }}
                />
              </label>
            </form>
            <div className="relative" ref={optionsMenuRef}>
              <button
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="p-2 hover:border-teal-500 relative"
              >
                <span className="absolute inset-0 border-2 border-transparent hover:border-teal-500"></span>
                &#8943;
              </button>

              {showOptionsMenu && (
                <div className="absolute top-full left-0 bg-white p-1 rounded border border-gray-300">
                  {!isEditingPhone && (
                    <button
                      onClick={handleEditPhone}
                      className="text-black p-1 block w-full text-left cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={handleCancelEditPhone}
                    className="text-black p-1 block w-full text-left cursor-pointer"
                  >
                    Cancel
                  </button>

                  {isEditingPhone && (
                    <button
                      onClick={handleFormSubmit}
                      className="bg-white text-black p-1 block w-full text-left cursor-pointer"
                    >
                      Save
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Image
              src={session?.user?.image ?? ""}
              alt={`${session?.user?.name}'s profile picture`}
              height={100}
              width={100}
              className="border-4 border-teal-500 rounded-full "
            />
          </div>

          {loading ? (
            <p>Loading medications...</p>
          ) : (
            <>
              {medications.length > 0 ? (
                <table className="mt-4 border border-gray-300">
                  <thead>
                    <tr>
                      <th className="p-2 font-medium">Medicine</th>
                      <th className="p-2 font-medium">Dose</th>
                      <th className="p-2 font-medium">Log Window (Start)</th>
                      <th className="p-2 font-medium">Log Window (End)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((medication) => (
                      <tr
                        key={medication.name}
                        className="border-t border-gray-300 text-center"
                      >
                        <td className="p-3">
                          {capitalizeFirstLetter(medication.name)}
                        </td>
                        <td className="p-3 text-center">
                          {`${medication.dose} ${medication.doseUnit}`}
                        </td>
                        <td className="p-3 text-center">
                          {format(
                            parse(
                              medication.logWindowStart,
                              "HH:mm:ss",
                              new Date()
                            ),
                            "hh:mm a"
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {format(
                            parse(
                              medication.logWindowEnd,
                              "HH:mm:ss",
                              new Date()
                            ),
                            "hh:mm a"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-4">No medications found</p>
              )}
            </>
          )}
        </section>
      )}
      {status !== "authenticated" && (
        <div className="min-h-screen flex items-center justify-center">
          <p>You are not signed in</p>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
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