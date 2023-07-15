import { useMonthlyCalendar } from "@zach.codes/react-calendar";
import { format, addMonths, getYear, subMonths } from "date-fns";

export const MonthlyNav = () => {
  let { currentMonth, onCurrentMonthChange } = useMonthlyCalendar();

  return (
    <div className=" border-t-2 border-l-2 border-r-2 flex justify-between text-lg  bg-white py-2 px-3 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
      <button
        onClick={() => onCurrentMonthChange(subMonths(currentMonth, 1))}
        className="cursor-pointer  bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white inline-flex"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-5 w-5"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
        Previous
      </button>
      <div className="text-center text-2xl ">
        {format(
          currentMonth,
          getYear(currentMonth) === getYear(new Date()) ? "LLLL" : "LLLL yyyy"
        )}
      </div>
      <button
        onClick={() => onCurrentMonthChange(addMonths(currentMonth, 1))}
        className="cursor-pointer bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white inline-flex"
      >
        Next
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="inline-block h-5 w-5 ml-1 align-middle"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};
