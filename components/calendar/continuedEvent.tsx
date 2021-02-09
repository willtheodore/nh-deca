import * as React from "react";
import cn from "classnames";
import { CalendarEvent } from "../../utils/calendar";

interface ContinuedEventProps {
  event: CalendarEvent;
  edit: boolean;
  setDisplay?: React.Dispatch<React.SetStateAction<CalendarEvent | null>>;
}
export default function ContinuedEvent({
  event,
  edit,
  setDisplay,
}: ContinuedEventProps) {
  return (
    <div
      onClick={!edit ? () => setDisplay!(event) : undefined}
      className={cn({
        "bg-blue-400 flex p-1 justify-between items-center": true,
        "hover: bg-decaBlue transition-colors duration-300 cursor-pointer line-clamp-2": !edit,
      })}
    >
      <p
        className={cn({
          "text-white tablet:whitespace-nowrap text-xs": true,
          "whitespace-pre-wrap": !edit,
        })}
      >
        {event.title + " cont."}
      </p>
    </div>
  );
}
