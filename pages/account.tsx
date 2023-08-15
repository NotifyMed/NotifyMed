import axios from "axios";
import { format, parse } from "date-fns";
import { CSVLink } from "react-csv";
import useSWR from "swr";
import * as yup from "yup";
import { GetServerSidePropsContext } from "next";
import { useSession, getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { splitDateTime } from "@/utils/splitDateTimeUtility";
import { Medication } from "@/types/medicationTypes";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import React from "react";

type Profile = {
  phone: string;
};

interface AccountProps {
  defaultValues?: Profile;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
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
  const [medicationSchedules, setMedicationSchedules] = useState<Medication[]>(
    []
  );
  const [medicationLogs, setMedicationLogs] = useState<Medication[]>([]);

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

  const medicationScheduleData = () => {
    const csvData = userMedications.map((medication) => {
      const schedule = medicationSchedules.find(
        (schedule) => schedule.id === medication.id
      );
      return {
        Name: session?.user?.name,
        Medication: capitalizeFirstLetter(medication.name),
        Dose: `${medication.dose}${medication.doseUnit}`,
        "Log Window (Start)":
          schedule && schedule.logWindowStart
            ? format(
                parse(schedule.logWindowStart, "HH:mm:ss", new Date()),
                "hh:mm a"
              )
            : "N/A",
        "Log Window (End)":
          schedule && schedule.logWindowEnd
            ? format(
                parse(schedule.logWindowEnd, "HH:mm:ss", new Date()),
                "hh:mm a"
              )
            : "N/A",
        "Log Frequency (Hours)":
          schedule && schedule.logFrequency ? schedule.logFrequency : "N/A",
      };
    });

    return csvData;
  };

  const medicationLogData = () => {
    const csvData = userMedications.map((medication) => {
      const logs = medicationLogs.find((log) => log.id === medication.id);
      return {
        Name: session?.user?.name,
        Medication: capitalizeFirstLetter(medication.name),
        "Date Taken": logs ? splitDateTime(logs.dateTaken).formattedDate : "",
        "Time Taken": logs ? splitDateTime(logs.dateTaken).formattedTime : "",
      };
    });

    return csvData;
  };

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch medication logs
        const logResponse = await axios.get(
          "/api/medication?action=GET_MEDICATION_LOG"
        );
        const logData = logResponse.data;
        setMedicationLogs(logData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

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
          <p className="text-xl font-semibold text-white">
            {data.phone
              ? `Welcome back, ${session?.user?.name}!`
              : `Welcome, ${session?.user?.name}!`}
          </p>
          {!data.phone && (
            <p className="text-md text-white">
              By providing your phone number, you will be able to start
              receiving text reminders!
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
                <input
                  className={`ml-2 p-2 border rounded ${
                    editing ? "text-white bg-black" : "text-black bg-white"
                  }`}
                  type="text"
                  id="phone"
                  value={phoneNumber || data.phone}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onClick={() => setEditing(true)}
                  onKeyDown={handleKeyDown}
                  readOnly={!editing}
                />
              </label>

              <div className="relative mr-2" ref={optionsMenuRef}>
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
          <div className="w-full max-w-md px-2 py-16 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-black",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                >
                  Schedule
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-black",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                >
                  Logs
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  {loading ? (
                    <p>Loading medication schedule...</p>
                  ) : (
                    <>
                      {medicationSchedules.length > 0 ? (
                        <table className="mt-4 border border-gray-300 w-full">
                          <thead>
                            <tr>
                              <th className="p-2 font-medium">Medication</th>
                              <th className="p-2 font-medium">Dose</th>
                              <th className="p-2 font-medium">
                                Log Window (Start)
                              </th>
                              <th className="p-2 font-medium">
                                Log Window (End)
                              </th>
                              <th className="p-2 font-medium">
                                Log Frequency (Hours)
                              </th>
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
                                    {`${medication.dose}${medication.doseUnit}`}
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
                                  <td>{schedule && schedule.logFrequency}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-white">
                          <p className="mt-4 ">
                            No medication schedules found.
                          </p>
                          <p className="mt-4">
                            Head to the{" "}
                            <Link
                              href="/schedule"
                              className="font-bold cursor-pointer"
                            >
                              schedule
                            </Link>{" "}
                            page to start scheduling.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-end mt-4">
                    {userMedications.length > 0 ? (
                      <div className="flex justify-end mt-4">
                        <CSVLink
                          data={medicationScheduleData()}
                          filename="medicationschedule.csv"
                          className="py-2 px-4 text-white hover:text-black font-semibold rounded-md shadow hover:bg-white border border-white flex items-center"
                        >
                          Export CSV
                        </CSVLink>
                      </div>
                    ) : null}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  {loading ? (
                    <p>Loading medication logs...</p>
                  ) : (
                    <>
                      {medicationLogs.length > 0 ? (
                        <table className="mt-4 border border-gray-300 w-full">
                          <thead>
                            <tr>
                              <th className="p-2 font-medium">Medication</th>
                              <th className="p-2 font-medium">Date Taken</th>
                              <th className="p-2 font-medium">Time Taken</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userMedications.map((medication) => {
                              const logs = medicationLogs
                                .filter(
                                  (log) => log.medication_id === medication.id
                                )
                                .sort(
                                  (a, b) =>
                                    new Date(a.dateTaken).getTime() -
                                    new Date(b.dateTaken).getTime()
                                );

                              return (
                                <React.Fragment key={medication.id}>
                                  {logs.map((log) => (
                                    <tr
                                      key={log.id}
                                      className="border-t border-gray-300 text-center"
                                    >
                                      <td className="p-3">
                                        {capitalizeFirstLetter(medication.name)}
                                      </td>
                                      <td className="p-3">
                                        {
                                          splitDateTime(log.dateTaken)
                                            .formattedDate
                                        }
                                      </td>
                                      <td className="p-3">
                                        {
                                          splitDateTime(log.dateTaken)
                                            .formattedTime
                                        }
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-white">
                          <p className="mt-4">No medication logs found.</p>
                          <p className="mt-4">
                            Head to the{" "}
                            <Link
                              href="/schedule"
                              className="font-bold cursor-pointer"
                            >
                              schedule
                            </Link>{" "}
                            page to start logging.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-end mt-4">
                    {medicationLogs.length > 0 ? (
                      <div className="flex justify-end mt-4">
                        <CSVLink
                          data={medicationLogData()}
                          filename="medicationlogs.csv"
                          className="py-2 px-4 text-white hover:text-black font-semibold rounded-md shadow hover:bg-white border border-white flex items-center"
                        >
                          Export CSV
                        </CSVLink>
                      </div>
                    ) : null}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
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
