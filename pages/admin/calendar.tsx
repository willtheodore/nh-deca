import Head from "next/head";
import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";
import CreateEvent from "../../components/admin/calendar/createEvent";
import cn from "classnames";
import EditCalendar from "../../components/admin/calendar/editCalendar";
import { CalendarEvent, deleteEvent } from "../../utils/calendar";
import Modal from "react-responsive-modal";
import EditEventModal from "../../components/admin/calendar/editEventModal";

export enum CalendarMode {
  default,
  create,
  edit,
  editEvent,
  delete,
  success,
  error,
}
export enum CalendarAction {
  create,
  edit,
  editEvent,
  delete,
  reset,
  success,
  error,
}
export interface CalendarDispatch {
  type: CalendarAction;
  mode?: string;
  message?: string;
  event?: CalendarEvent;
}

interface CalendarState {
  mode: CalendarMode;
  message: string;
  event: CalendarEvent | null;
}
const reducer: React.Reducer<CalendarState, CalendarDispatch> = (
  state: CalendarState,
  action: CalendarDispatch
) => {
  switch (action.type) {
    case CalendarAction.create:
      return { ...state, mode: CalendarMode.create };
    case CalendarAction.edit:
      return { mode: CalendarMode.edit, event: null, message: "" };
    case CalendarAction.editEvent:
      return {
        ...state,
        mode: CalendarMode.editEvent,
        event: action.event ? action.event : null,
      };
    case CalendarAction.delete:
      return {
        ...state,
        mode: CalendarMode.delete,
        event: action.event ? action.event : null,
      };
    case CalendarAction.reset:
      return { mode: CalendarMode.default, message: "", event: null };
    case CalendarAction.success:
      return {
        event: null,
        mode: CalendarMode.success,
        message: action.message ? action.message : "",
      };
    case CalendarAction.error:
      return {
        event: null,
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
    event: null,
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const remove = async () => {
    if (state.event) {
      const res = await deleteEvent(state.event);
      if (res === "Success")
        dispatch({
          type: CalendarAction.success,
          message: "The event was successfully deleted.",
        });
      else
        dispatch({
          type: CalendarAction.error,
          message:
            "We ran into an error deleting that event. Please try again.",
        });
    } else {
      dispatch({
        type: CalendarAction.error,
        message:
          "We couldn't find the event you want to delete. Please try again.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Admin - Manage the NH DECA Calendar</title>
      </Head>

      {state.mode === CalendarMode.delete && (
        <Modal
          open={state.mode === CalendarMode.delete && state.event !== null}
          onClose={() => dispatch({ type: CalendarAction.edit })}
          center
        >
          <div className="flex items-center justify-center p-10 space-x-4">
            <button
              className="white-rounded"
              onClick={() => dispatch({ type: CalendarAction.edit })}
            >
              Cancel
            </button>
            <button className="blue-rounded" onClick={remove}>
              Delete
            </button>
          </div>
        </Modal>
      )}

      {state.mode === CalendarMode.editEvent && (
        <Modal
          open={state.mode === CalendarMode.editEvent && state.event !== null}
          onClose={() => dispatch({ type: CalendarAction.edit })}
          center
        >
          <EditEventModal event={state.event} dispatch={dispatch} />
        </Modal>
      )}

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
