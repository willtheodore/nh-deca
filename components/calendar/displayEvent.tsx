import * as React from "react";
import { CalendarEvent } from "../../utils/calendar";

interface DispalyEventProps {
  event: CalendarEvent;
}
export default function DispalyEvent({ event }: DispalyEventProps) {
  return <>{event.toString()}</>;
}
