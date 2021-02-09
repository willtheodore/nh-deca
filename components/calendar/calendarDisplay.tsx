import * as React from "react";
import { CalendarDispatch } from "../../pages/admin/calendar";
import { CalendarEvent, getEventsInMonth } from "../../utils/calendar";
import styles from "./calendarDisplay.module.css";
import EditEvent from "./editEvent";
import DisplayEvent from "./displayEvent";

interface CalendarSquare {
  day: number | null;
  events: CalendarEvent[] | null;
}

interface CalendarDisplayProps {
  edit: boolean;
  dispatch?: React.Dispatch<CalendarDispatch>;
}
export default function CalendarDisplay({
  edit,
  dispatch,
}: CalendarDisplayProps) {
  const initialToday = new Date(Date.now());
  const [month, setMonth] = React.useState(initialToday.getMonth());
  const [squares, setSquares] = React.useState<CalendarSquare[] | null>(null);
  const [year, setYear] = React.useState(initialToday.getFullYear());

  React.useEffect(() => {
    getSquares();
  }, [month, year]);

  const incrementMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const decrementMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const getSquares = async () => {
    const arr: CalendarSquare[] = [];
    const days = getDays(month, year);
    const firstDay = toMondayStart(new Date(year, month).getDay());

    for (let i = 0; i < firstDay; i++) {
      arr.push({
        day: null,
        events: null,
      });
    }

    const eventsInMonth = await getEventsInMonth(year, month);
    if (eventsInMonth) {
      for (let i = 1; i <= days; i++) {
        if (eventsInMonth[i] === undefined)
          arr.push({
            day: i,
            events: null,
          });
        else
          arr.push({
            day: i,
            events: eventsInMonth[i],
          });
      }

      const lastDay = toMondayStart(new Date(year, month, days).getDay());
      for (let i = 0; i < 6 - lastDay; i++) {
        arr.push({
          day: null,
          events: null,
        });
      }

      setSquares(arr);
    }
  };

  return (
    <>
      <div className="flex w-full space-x-2 items-center justify-center">
        <button className={styles.monthSwitch} onClick={decrementMonth}>
          {"<"}
        </button>
        <p className={styles.dateHeader}>{`${getMonthString(
          month
        )} ${year}`}</p>
        <button className={styles.monthSwitch} onClick={incrementMonth}>
          {">"}
        </button>
      </div>

      <div
        className={styles.container}
        style={{
          gridTemplateRows: `auto repeat("1fr", ${getWeeks(month, year)})`,
        }}
      >
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day, index) => (
          <p
            key={index}
            className={styles.dayLabel}
            style={{
              gridColumn: `${index + 1} / ${index + 2}`,
              gridRow: "1 / 2",
            }}
          >
            {day}
          </p>
        ))}
        {squares &&
          squares.map((square, sIndex) => (
            <div className={styles.squareWrapper} key={sIndex}>
              {square.day && <p className={styles.dateLabel}>{square.day}</p>}
              {square.events && (
                <ul className="w-full space-y-1">
                  {square.events.map((event, index) => (
                    <li key={index} className="w-full">
                      {edit && dispatch ? (
                        <EditEvent event={event} dispatch={dispatch} />
                      ) : (
                        <DisplayEvent event={event} />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

function getMonthString(month: number) {
  const monthStrings = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthStrings[month];
}

function getWeeks(month: number, year: number) {
  const days = getDays(month, year);
  const firstDay = new Date(year, month);
  const weekday = toMondayStart(firstDay.getDay() + 1);
  if (month === 1 && weekday === 0) return 4;
  const remainderDays = days % 7;
  const distFromSunday = 6 - weekday;
  if (distFromSunday <= remainderDays - 1) return 6;
  else return 5;
}

function toMondayStart(rawDay: number) {
  if (rawDay === 0) return 6;
  else return rawDay - 1;
}

function getDays(month: number, year: number) {
  const leapYear = isLeapYear(year);
  const daysPerMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return daysPerMonth[month];
}

function isLeapYear(year: number) {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}
