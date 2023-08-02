import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWR from "swr";

import { Medication } from "@/types/medicationTypes";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { format, parse } from "date-fns";


type Profile = {
  phone: string;
};

interface AccountProps {
  defaultValues?: Profile;
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const fetcher = async (url: string, ...args: any[]) => {
    const response = await fetch(url, ...args);
    return response.json();
  };

  export default function Account({ defaultValues }: AccountProps) {
    const { data: session, status } = useSession({ required: true });
    const { data, error, isLoading } = useSWR("/api/user/", (url) =>
      fetcher(url, { method: "GET" })
    );
    const [userMedications, setUserMedications] = useState<Medication[]>([]);
    const [medicationSchedules, setMedicationSchedules] = useState<
      Medication[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [editing, setEditing] = useState(false);
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    const schema = yup.object().shape({
      phone: yup.string().matches(phoneRegExp, "Phone number is not valid"),
    });

    const handleEditPhone = () => {
      setShowOptionsMenu(false);
      setPhoneNumber((prevPhone) => prevPhone || data.phone);
      setEditing(true);
    };

    const handleCancelEditPhone = () => {
      setShowOptionsMenu(false);
      setPhoneNumber(data.phone);
      setEditing(false);
    };

    const handleClickOutsideMenu = (e: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(e.target as Node)
      ) {
        setShowOptionsMenu(false);
      }
    };

    console.log(session);

    const {
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
      defaultValues,
    });

    const handleFormSubmit = async (data: any) => {
      const userInfo = {
        email: session?.user?.email,
        phone: phoneNumber,
      };

      try {
        const res = await axios.patch("/api/user", userInfo);
        if (res.status === 200) {
          console.log("Phone number saved successfully:", res.data);
        }
        console.log(userInfo.phone);
      } catch (error) {
        console.error("Error saving phone number:", error);
      }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setShowOptionsMenu(false);
        await handleFormSubmit(data);
      }
    };

    useEffect(() => {
      const getUserMedications = async () => {
        try {
          // Fetch user medications
          const medicationResponse = await axios.get("/api/medication");
          const medicationData = medicationResponse.data;
          setUserMedications(medicationData);

          // Fetch medication schedules
          const scheduleResponse = await axios.get(
            "/api/medication?action=GET_MEDICATION_SCHEDULE"
          );
          const scheduleData = scheduleResponse.data;
          setMedicationSchedules(scheduleData);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching medications:", error);
          setLoading(false);
        }
      };

      getUserMedications();

      document.addEventListener("click", handleClickOutsideMenu);

      return () => {
        document.removeEventListener("click", handleClickOutsideMenu);
      };
    }, []);
    if (error)
      return (
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 animate-fade-in-up min-h-screen flex flex-col items-center justify-center">
          Failed to load
        </div>
      );
    if (isLoading)
      return (
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 animate-fade-in-up min-h-screen flex flex-col items-center justify-center">
          Loading...
        </div>
      );

    return (
      <div className="bg-gray-dark">
        {status === "authenticated" && (
          <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-24 animate-fade-in-up min-h-screen flex flex-col items-center justify-center">
            <p className="text-xl font-semibold">
              {data.phone
                ? `Welcome back, ${session?.user?.name}!`
                : `Welcome, ${session?.user?.name}!`}
            </p>
            {!data.phone && (
              <p className="text-md">
                By providing your phone number, you will be able to start
                receiving text reminders.
              </p>
            )}
            <div className="mt-4">
              <Image
                src={session?.user?.image ?? ""}
                alt={`${session?.user?.name}'s profile picture`}
                height={100}
                width={100}
                className="border-4 border-teal-500 rounded-full "
              />
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="flex items-center mt-4">
                <label className="text-white font-medium" htmlFor="phone">
                  Phone:
                  {editing ? (
                    <input
                      className="ml-2 text-black bg-white p-2 border border-gray-300 rounded"
                      type="text"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    <span className="ml-2 text-black bg-white p-2 border border-gray-300 rounded">
                      {data.phone}
                    </span>
                  )}
                </label>
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
                      {!editing && (
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

                      {editing && (
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
            </form>
            {loading ? (
              <p>Loading medications...</p>
            ) : (
              <>
                {userMedications.length > 0 ? (
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
                      {userMedications.map((medication) => {
                        const schedule = medicationSchedules.find(
                          (schedule) => schedule.id === medication.id
                        );
                        return (
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
                              {schedule && schedule.logWindowStart
                                ? format(
                                    parse(
                                      schedule.logWindowStart,
                                      "HH:mm:ss",
                                      new Date()
                                    ),
                                    "hh:mm a"
                                  )
                                : "N/A"}
                            </td>
                            <td className="p-3 text-center">
                              {schedule && schedule.logWindowEnd
                                ? format(
                                    parse(
                                      schedule.logWindowEnd,
                                      "HH:mm:ss",
                                      new Date()
                                    ),
                                    "hh:mm a"
                                  )
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
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