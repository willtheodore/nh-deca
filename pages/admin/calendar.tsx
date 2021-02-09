import Head from "next/head";
import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";
import CreateEvent from "../../components/admin/calendar/createEvent";
import cn from "classnames";
import EditCalendar from "../../components/admin/calendar/editCalendar";

export enum CalendarMode {
  default,
  create,
  edit,
  success,
  error,
}

export enum CalendarAction {
  create,
  reset,
  success,
  error,
  edit,
}
export interface CalendarDispatch {
  type: CalendarAction;
  mode?: string;
  message?: string;
}

interface CalendarState {
  mode: CalendarMode;
  message: string;
}
const reducer: React.Reducer<CalendarState, CalendarDispatch> = (
  state: CalendarState,
  action: CalendarDispatch
) => {
  switch (action.type) {
    case CalendarAction.edit:
      return { ...state, mode: CalendarMode.edit };
    case CalendarAction.create:
      return { ...state, mode: CalendarMode.create };
    case CalendarAction.reset:
      return { mode: CalendarMode.default, message: "" };
    case CalendarAction.success:
      return {
        mode: CalendarMode.success,
        message: action.message ? action.message : "",
      };
    case CalendarAction.error:
      return {
        mode: CalendarMode.error,
        message: action.message ? action.message : "",
      };
    default:
      throw new Error();
  }
};

export default function Calendar() {
  const initialState = {
    mode: CalendarMode.default,
    message: "",
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <>
      <Head>
        <title>Admin - Manage the NH DECA Calendar</title>
      </Head>

      <AdminLayout>
        <>
          <h1 className="text-white uppercase font-bold text-4xl py-5">
            Calendar Manager
          </h1>

          {(state.mode === CalendarMode.error ||
            state.mode === CalendarMode.success) && (
            <div
              className="w-full cursor-pointer"
              onClick={() => dispatch({ type: CalendarAction.reset })}
            >
              <p
                className={cn({
                  "mx-auto uppercase text-2xl": true,
                  "text-red-500": state.mode === CalendarMode.error,
                  "text-green-500": state.mode === CalendarMode.success,
                })}
              >
                {state.message + " Click to dismiss."}
              </p>
            </div>
          )}

          {state.mode === CalendarMode.default && (
            <div className="flex space-x-5">
              <button
                onClick={() => dispatch({ type: CalendarAction.create })}
                className="blue-pill"
              >
                CREATE A CALENDAR EVENT
              </button>
              <button
                onClick={() => dispatch({ type: CalendarAction.edit })}
                className="blue-pill"
              >
                EDIT A CALENDAR EVENT
              </button>
            </div>
          )}

          {state.mode === CalendarMode.create && (
            <CreateEvent dispatch={dispatch} />
          )}

          {state.mode === CalendarMode.edit && (
            <EditCalendar dispatch={dispatch} />
          )}
        </>
      </AdminLayout>
    </>
  );
}
