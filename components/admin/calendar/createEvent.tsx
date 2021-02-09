import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as React from "react";
import {
  CalendarAction,
  CalendarDispatch,
} from "../../../pages/admin/calendar";
import styles from "./createEvent.module.css";
import { CalendarEvent, createEvent } from "../../../utils/calendar";

export const dateShape = {
  day: Yup.number()
    .required("A day is required.")
    .max(31, "The max day number is 31.")
    .min(1, "The min day number is 1."),
  month: Yup.number()
    .required("A month is required.")
    .max(12, "The max month number is 12.")
    .min(1, "The min month number is 1."),
  year: Yup.number()
    .required("A year is required.")
    .max(9999, "Years must be 4 digits.")
    .min(2020, "The min year number is 2020."),
  hour: Yup.number()
    .required("A hour is required.")
    .max(24, "The max hour number is 24")
    .min(0, "The min hour number is 0."),
  minute: Yup.number()
    .required("A minute is required.")
    .max(60, "The max minute number is 60.")
    .min(0, "The min minute number is 0."),
};

const schema = Yup.object().shape({
  title: Yup.string().required("A title is required."),
  description: Yup.string().required("A description is required."),
  startDate: Yup.object().shape(dateShape),
  endDate: Yup.object().shape(dateShape),
});

export interface CalendarValues {
  title: string;
  description: string;
  startDate: {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
  };
  endDate: {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
  };
}

const initialValues = {
  title: "",
  description: "",
  startDate: {
    day: 0,
    month: 0,
    year: 0,
    hour: 0,
    minute: 0,
  },
  endDate: {
    day: 0,
    month: 0,
    year: 0,
    hour: 0,
    minute: 0,
  },
};

interface CreateEventProps {
  dispatch: React.Dispatch<CalendarDispatch>;
}
export default function CreateEvent({ dispatch }: CreateEventProps) {
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

    const event = new CalendarEvent({
      title,
      startDate: sDate,
      endDate: eDate,
      multiDay,
      description,
    });

    const res = await createEvent(event);
    if (res === "Success") {
      dispatch({
        type: CalendarAction.success,
        message: "Success! We were able to create that event.",
      });
    } else {
      dispatch({
        type: CalendarAction.error,
        message: "Uh oh! We ran into an error creating that event.",
      });
    }
  };

  return (
    <>
      <button
        className="white-pill uppercase"
        onClick={() => dispatch({ type: CalendarAction.reset })}
      >
        {"< Back"}
      </button>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
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
    </>
  );
}

interface Errors {
  [key: string]: any;
}
export function getErrors(errors: Errors) {
  const arr: any[] = [];
  for (const key in errors) {
    arr.push(errors[key]);
  }
  return arr;
}

export interface DateObject {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
}
export function getDateFromObject({
  day,
  month,
  year,
  hour,
  minute,
}: DateObject) {
  const date = new Date(year, month - 1, day, hour, minute);
  return date;
}

interface DateBundleprops {
  name: string;
  label: string;
}
export function DateBundle({ name, label }: DateBundleprops) {
  return (
    <div>
      <label className={styles.label}>{label}</label>
      <p className={styles.info}>Please enter times in 24 hour time.</p>
      <div className="flex items-center">
        <p className={styles.dateLabel}>DAY:</p>
        <div className={styles.wrapper}>
          <Field
            name={`${name}.month`}
            className={styles.smallField}
            type="number"
          />
          <p className={styles.divider}>/</p>
          <Field
            name={`${name}.day`}
            className={styles.smallField}
            type="number"
          />
          <p className={styles.divider}>/</p>
          <Field
            name={`${name}.year`}
            className={styles.mediumField}
            type="number"
          />
        </div>
        <p className={styles.dateLabel}>TIME:</p>
        <div className={styles.wrapper}>
          <Field
            name={`${name}.hour`}
            className={styles.smallField}
            type="number"
          />
          <p className={styles.divider}>:</p>
          <Field
            name={`${name}.minute`}
            className={styles.smallField}
            type="number"
          />
        </div>
      </div>
    </div>
  );
}

interface InputBundleProps {
  name: string;
  type: string;
  label: string;
}
export function InputBundle({ name, type, label }: InputBundleProps) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      {type !== "textarea" ? (
        <Field name={name} type={type} className={styles.field} />
      ) : (
        <Field name={name} as="textarea" className={styles.textarea} />
      )}
      <ErrorMessage
        name={name}
        render={(msg) => <p className={styles.error}>{msg}</p>}
      />
    </div>
  );
}
