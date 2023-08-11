import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  BsEnvelope,
  BsPhone,
  BsPhoneVibrate,
  BsStopwatch,
} from "react-icons/bs";

function CalendarAnimation({ index }: { index: number }) {
  return (
    <motion.img
      src={`/images/cal${index + 1}.png`}
      alt="Calendar"
      initial={{ x: 0 }}
      className="w-16 h-16"
    />
  );
}

function HowItWorks() {
  const controls = useAnimation();
  const step5Ref = useRef(null);
  const [calendarImageIndex, setCalendarImageIndex] = useState(0);

  const animationConfig = {
    x: [0, -3, 3, -2, 2, 0],
    transition: {
      repeat: Infinity,
      duration: 3,
    },
  };

  useEffect(() => {
    const step5Observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start(animationConfig);
        } else {
          controls.stop();
        }
      },
      { threshold: 0.5 }
    );

    if (step5Ref.current) {
      step5Observer.observe(step5Ref.current);
    }

    return () => {
      if (step5Ref.current) {
        step5Observer.unobserve(step5Ref.current);
      }
    };
  }, [controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start(animationConfig);
    }, 4000);

    return () => clearInterval(interval);
  }, [controls]);

  const updateImageIndex = () => {
    setCalendarImageIndex((prevIndex) => (prevIndex + 1) % 4);
  };

  useEffect(() => {
    const interval = setInterval(updateImageIndex, 4000);

    return () => clearInterval(interval);
  }, []);

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
      title: "Schedule Your Medication",
      text: "Once you arrive at the schedule page, you'll be able to add in your medication. All that's needed on your end is the name of the medication, dose, dose unit and a specified timeframe. You'll be able to see your scheduled medications in your account page.",
      icon: <BsStopwatch />,
    },
    {
      number: 4,
      title: "Log Your Medication",
      text: "After scheduling your medication, you'll be able to select which medication you want to log. By selecting a date and time, you'll be able to see your medication logged onto the calendar and in your account page.",
      icon: <CalendarAnimation index={calendarImageIndex} />,
    },
    {
      number: 5,
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
        <div key={step.number}>
          <div
            className={`flex flex-col md:flex-row mx-5 justify-center items-center ${
              step.number % 2 !== 0 && "md:flex-row-reverse"
            }`}
          >
            <div className="text-7xl">
              {step.number === 5 ? (
                <motion.div
                  ref={step5Ref}
                  animate={controls}
                  initial={{ x: 0 }}
                >
                  {step.icon}
                </motion.div>
              ) : (
                step.icon
              )}
            </div>
            <div className={`w-96 mx-5 text-center md:text-left`}>
              <p className="text-3xl font-semibold">{step.number}</p>
              <p className="text-xl">{step.title}</p>
              <p>{step.text}</p>
              {step.number % 5 !== 0 && <hr className="my-5" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HowItWorks;
