import * as React from "react";
import { CalendarEvent } from "../../utils/calendar";

interface DispalyEventProps {
  event: CalendarEvent;
  setDisplay: React.Dispatch<React.SetStateAction<CalendarEvent | null>>;
}
export default function DispalyEvent({ event, setDisplay }: DispalyEventProps) {
  return (
    <div
      className="bg-blue-800 flex p-1 justify-between items-center cursor-pointer hover:bg-decaBlue transition-colors duration-300 line-clamp-2"
      onClick={() => setDisplay(event)}
    >
      <p className="text-white whitespace-pre-wrap break-words tablet:whitespace-nowrap text-xs uppercase tracking-wide">
        {event.title}
      </p>
    </div>
  );
}
