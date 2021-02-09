import * as React from "react";
import { CalendarAction, CalendarDispatch } from "../../pages/admin/calendar";
import { CalendarEvent } from "../../utils/calendar";

interface EditEventProps {
  dispatch: React.Dispatch<CalendarDispatch>;
  event: CalendarEvent;
}
export default function EditEvent({ dispatch, event }: EditEventProps) {
  return (
    <div className="bg-decaBlue flex p-1 justify-between items-center">
      <div className="overflow-hidden">
        <p className="text-white whitespace-nowrap text-xs">{event.title}</p>
      </div>
      <div className="flex">
        <img
          className="text-white"
          src="/svg/edit.svg"
          onClick={() =>
            dispatch({ type: CalendarAction.editEvent, event: event })
          }
        />
        <img
          src="/svg/delete.svg"
          onClick={() =>
            dispatch({ type: CalendarAction.delete, event: event })
          }
        />
      </div>
    </div>
  );
}
