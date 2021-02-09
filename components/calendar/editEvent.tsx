import * as React from "react";
import { CalendarDispatch } from "../../pages/admin/calendar";
import { CalendarEvent } from "../../utils/calendar";

interface EditEventProps {
  dispatch: React.Dispatch<CalendarDispatch>;
  event: CalendarEvent;
}
export default function EditEvent({ dispatch, event }: EditEventProps) {
  return <div className="bg-blue">{event.title}</div>;
}
