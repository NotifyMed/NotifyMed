import Image from "next/image";
import {
  BsCalendar3,
  BsCalendarPlus,
  BsEnvelope,
  BsPhone,
  BsPhoneVibrate,
  BsStopwatch,
} from "react-icons/bs";

import { MdOutlineSchedule, MdSchedule } from "react-icons/md";

function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Login With Gmail",
      text: "You'll be able to login with your Gmail account. Forgotten passwords will be a thing of the past.",
      icon: <BsEnvelope />,
    },
    {
      number: 2,
      title: "Set Up Text Notifications",
      text: "Upon logging in, we'll ask you for your phone number. This is how we'll be able to send you text reminders about your medication(s).",
      icon: <BsPhone />,
    },
    {
      number: 3,
      title: "Add Medication",
      text: "Once you arrive at the schedule page, you'll be able to add in your medication. All that's needed on your end is the name of the medication, dose, dose unit.",
      icon: <BsCalendarPlus />,
    },
    {
      number: 4,
      title: "Schedule Your Medication",
      text: "All we need from you is how often you'll be taking your medications and a specified timeframe. You'll be able to see your scheduled medications in your account page.",
      icon: <BsStopwatch />,
    },
    {
      number: 5,
      title: "Log Your Medication",
      text: "After scheduling your medication, you'll are now able to find your added medications. By selecting a date and time, you'll be able to see your medication logged onto the calendar.",
      icon: <BsCalendar3 />,
    },
    {
      number: 6,
      title: "GET READY TO BE NOTIFIED",
      text: "Our system will check if you have logged your medication within your scheduled timeframe. If it hasn't been logged, we'll send out a text to remind you. It's that simple!",
      icon: <BsPhoneVibrate />,
    },
  ];

  return (
    <div>
      <p className="text-2xl text-bold sm:text-4xl text-center mb-10">
        How It Works
      </p>
      {steps.map((step) => (
        <div key={step.number} className="">
          <div
            className={`flex flex-col md:flex-row mx-5 justify-center items-center ${
              step.number % 2 !== 0 && "md:flex-row-reverse"
            }`}
          >
            <div className="text-7xl">{step.icon}</div>
            <div className={`w-96 mx-5 text-center md:text-left`}>
              <p className="text-3xl font-semibold">{step.number}</p>
              <p className="text-xl">{step.title}</p>
              <p className="">{step.text}</p>
              {step.number % 6 !== 0 && <hr className="my-5" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HowItWorks;
