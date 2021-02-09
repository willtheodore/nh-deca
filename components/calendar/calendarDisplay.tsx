import * as React from "react";
import { CalendarDispatch } from "../../pages/admin/calendar";
import { CalendarEvent, getEventsInMonth } from "../../utils/calendar";
import styles from "./calendarDisplay.module.css";
import EditEvent from "./editEvent";
import DisplayEvent from "./displayEvent";
import ContinuedEvent from "./continuedEvent";
import useBreakpoint from "../../hooks/useBreakpoint";

interface CalendarSquare {
  day: number | null;
  events: CalendarEvent[] | null;
  continuedEvents: CalendarEvent[] | null;
}

interface CalendarDisplayProps {
  edit: boolean;
  setDisplay?: React.Dispatch<React.SetStateAction<CalendarEvent | null>>;
  dispatch?: React.Dispatch<CalendarDispatch>;
}
export default function CalendarDisplay({
  edit,
  dispatch,
  setDisplay,
}: CalendarDisplayProps) {
  const breakpoint = useBreakpoint();
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
    let activeEvents: CalendarEvent[] = [];
    const hangingEvents: CalendarEvent[] = [];
    const days = getDays(month, year);
    const firstDay = toMondayStart(new Date(year, month).getDay());

    const getSquareForDay = (
      day: number,
      eventsOnDay: CalendarEvent[] | undefined
    ): CalendarSquare => {
      const events = [];
      const continuedEvents = [];

      // Add active Events
      for (const event of activeEvents) {
        continuedEvents.push(event);
        if (event.endDate.getDate() === day) {
          const index = activeEvents.indexOf(event);
          const newActive = [];
          for (let i = 0; i < activeEvents.length; i++) {
            if (i !== index) newActive.push(activeEvents[i]);
          }
          activeEvents = newActive;
        }
      }

      if (eventsOnDay) {
        for (const event of eventsOnDay) {
          if (
            event.startDate.getDate() === day &&
            event.startDate.getMonth() === month
          ) {
            // Event starts on this day
            if (!event.multiDay) {
              events.push(event);
            } else {
              activeEvents.push(event);
              events.push(event);
            }
          } else {
            hangingEvents.push(event);
          }
        }
      }

      return {
        day: day,
        events: events.length > 0 ? events : null,
        continuedEvents: continuedEvents.length > 0 ? continuedEvents : null,
      };
    };

    for (let i = 0; i < firstDay; i++) {
      arr.push({
        day: null,
        events: null,
        continuedEvents: null,
      });
    }

    const eventsInMonth = await getEventsInMonth(year, month);
    if (eventsInMonth) {
      for (let i = 1; i <= days; i++) {
        arr.push(getSquareForDay(i, eventsInMonth[i]));
      }
      for (const event of hangingEvents) {
        const eDay = event.endDate.getDate();
        for (let i = 0; i < eDay; i++) {
          const currentSquare = arr[i];
          currentSquare.continuedEvents
            ? currentSquare.continuedEvents.push(event)
            : (currentSquare.continuedEvents = [event]);
        }
      }

      const lastDay = toMondayStart(new Date(year, month, days).getDay());
      for (let i = 0; i < 6 - lastDay; i++) {
        arr.push({
          day: null,
          events: null,
          continuedEvents: null,
        });
      }
      setSquares(arr);
    }
  };

  return (
    <>
      <div className="flex w-full space-x-2 items-center justify-center">
        <button className={styles.monthSwitch} onClick={decrementMonth}>
          <img src="/svg/arrowLeft.svg" />
        </button>
        <p className={styles.dateHeader}>{`${getMonthString(
          month
        )} ${year}`}</p>
        <button className={styles.monthSwitch} onClick={incrementMonth}>
          <img src="/svg/arrowRight.svg" />
        </button>
      </div>

      <div
        className={styles.container}
        style={{
          gridTemplateRows: `auto repeat("1fr", ${getWeeks(month, year)})`,
        }}
      >
        {getDayArray(breakpoint).map((day, index) => (
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
              <ul className="w-full space-y-1">
                {square.continuedEvents?.map((event, index) => (
                  <li key={index} className="w-full overflow-hidden">
                    <ContinuedEvent
                      event={event}
                      edit={edit}
                      setDisplay={setDisplay}
                    />
                  </li>
                ))}
                {square.events &&
                  square.events.map((event, index) => (
                    <li key={index} className="w-full overflow-hidden">
                      {edit && dispatch ? (
                        <EditEvent event={event} dispatch={dispatch} />
                      ) : (
                        setDisplay && (
                          <DisplayEvent event={event} setDisplay={setDisplay} />
                        )
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </>
  );
}

function getDayArray(breakpoint: "phone" | "tablet" | "desktop" | undefined) {
  if (breakpoint !== "phone")
    return [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
  else return ["M", "T", "W", "T", "F", "S", "S"];
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
