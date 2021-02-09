import { Form, Formik, FormikHelpers } from "formik";
import * as React from "react";
import * as Yup from "yup";
import styles from "./editEventModal.module.css";
import {
  CalendarAction,
  CalendarDispatch,
} from "../../../pages/admin/calendar";
import { CalendarEvent, updateEvent } from "../../../utils/calendar";
import {
  CalendarValues,
  DateBundle,
  DateObject,
  dateShape,
  getDateFromObject,
  getErrors,
  InputBundle,
} from "./createEvent";

const schema = Yup.object().shape({
  title: Yup.string().required("A title is required."),
  description: Yup.string().required("A description is required."),
  startDate: Yup.object().shape(dateShape),
  endDate: Yup.object().shape(dateShape),
});

interface EditEventModalProps {
  event: CalendarEvent | null;
  dispatch: React.Dispatch<CalendarDispatch>;
}
export default function EditEventModal({
  event,
  dispatch,
}: EditEventModalProps) {
  if (!event || !event.id) {
    dispatch({
      type: CalendarAction.error,
      message: "Error obtaining the event to be edited.",
    });
    return <></>;
  }

  console.log(event);
  const initialValues = {
    title: event.title,
    startDate: toDateObject(event.startDate),
    endDate: toDateObject(event.startDate),
    description: event.description,
  };

  const handleSubmit = async (
    values: CalendarValues,
    actions: FormikHelpers<CalendarValues>
  ) => {
    const { title, startDate, endDate, description } = values;
    const sDate: Date = getDateFromObject(startDate);
    const eDate: Date = getDateFromObject(endDate);
    const multiDay =
      eDate.getDate() !== sDate.getDate() ||
      eDate.getMonth() !== sDate.getMonth();

    const updatedEvent = new CalendarEvent({
      id: event.id!,
      title,
      startDate: sDate,
      endDate: eDate,
      multiDay,
      description,
    });

    const res = await updateEvent(updatedEvent);
    if (res === "Success") {
      dispatch({
        type: CalendarAction.success,
        message: "Success! We were able to editing that event.",
      });
    } else {
      dispatch({
        type: CalendarAction.error,
        message: "Uh oh! We ran into an error editing that event.",
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      schema={schema}
    >
      {(props) => (
        <Form className={styles.form}>
          <InputBundle name="title" type="text" label="title" />

          <div>
            <DateBundle name="startDate" label="Start Date" />
            {props.errors.startDate &&
              props.touched.startDate &&
              getErrors(props.errors.startDate).map((err, index) => (
                <p key={index} className={styles.error}>
                  {err}
                </p>
              ))}
          </div>

          <div>
            <DateBundle name="endDate" label="End Date" />
            {props.errors.endDate &&
              props.touched.endDate &&
              getErrors(props.errors.endDate).map((err, index) => (
                <p key={index} className={styles.error}>
                  {err}
                </p>
              ))}
          </div>

          <p className={styles.info}>
            Calendar descriptions are written in markdown.
          </p>
          <InputBundle
            name="description"
            type="textarea"
            label="Event description"
          />

          <div className="flex space-x-2">
            <button className="white-rounded" type="reset">
              CLEAR
            </button>
            <button className="blue-rounded" type="submit">
              SUBMIT
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export function toDateObject(date: Date): DateObject {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}
