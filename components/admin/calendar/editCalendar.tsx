import * as React from "react";
import {
  CalendarAction,
  CalendarDispatch,
} from "../../../pages/admin/calendar";
import CalendarDisplay from "../../calendar/calendarDisplay";

interface EditEventProps {
  dispatch: React.Dispatch<CalendarDispatch>;
}
export default function EditCalendar({ dispatch }: EditEventProps) {
  return (
    <>
      <button
        className="white-pill uppercase mb-5"
        onClick={() => dispatch({ type: CalendarAction.reset })}
      >
        {"< Back"}
      </button>

      <CalendarDisplay edit dispatch={dispatch} />
    </>
  );
}
