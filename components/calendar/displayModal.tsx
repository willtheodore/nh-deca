import * as React from "react";
import marked from "marked";
import { CalendarEvent } from "../../utils/calendar";
import { DateObject } from "../admin/calendar/createEvent";
import { toDateObject } from "../admin/calendar/editEventModal";

interface DisplayModalProps {
  event: CalendarEvent;
}
export default function DisplayModal({ event }: DisplayModalProps) {
  const startDate = toDateObject(event.startDate);
  const endDate = toDateObject(event.endDate);
  const description = marked(event.description);
  let sameDay = false;
  if (
    startDate.day === endDate.day &&
    startDate.month === endDate.month &&
    startDate.year === endDate.year
  ) {
    sameDay = true;
  }

  return (
    <div className="flex flex-col items-start p-5 space-y-5 tablet:w-screen-1/2">
      <h1 className="text-white uppercase text-2xl font-semibold">
        {event.title}
      </h1>
      <hr className="w-full bg-white" />
      <div className="text-white">
        <p>{`Start: ${getDateString(sameDay, startDate)}`}</p>
        <p>{`End: ${getDateString(sameDay, endDate)}`}</p>
      </div>
      <hr className="w-full bg-white" />
      <div
        className="prose prose-sm overflow-hidden w-full max-w-none p-2 rounded-sm text-white event-display"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}

function getDateString(sameDay: boolean, date: DateObject) {
  const time = getTime(date);
  if (sameDay) return `${time.hour}:${time.minute} ${time.apm}`;
  else
    return `${date.month}/${date.day}/${date.year} ${time.hour}:${time.minute} ${time.apm}`;
}

type APM = "AM" | "PM";
export interface TimeObject {
  hour: string;
  minute: string;
  apm: APM;
}
function getTime(date: DateObject): TimeObject {
  let { hour, minute } = date;
  console.log(hour, minute);
  let apm: APM = "AM";
  let flag = false;
  if (hour >= 12) {
    apm = "PM";
    if (hour !== 12) hour = hour - 12;
  }
  if (minute < 10) flag = true;

  return {
    hour: `${hour}`,
    minute: `${flag ? "0" : ""}${minute}`,
    apm,
  };
}
