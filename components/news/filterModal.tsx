import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as React from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
import cn from "classnames";
import * as Yup from "yup";
import {
  fetchArticlesBetween,
  fetchArticlesWithTags,
  NewsArticle,
} from "../../utils/news";

const dateInitial = {
  startMonth: "",
  startDay: "",
  startYear: "",
  endMonth: "",
  endDay: "",
  endYear: "",
};
const dateSchema = Yup.object().shape({
  startMonth: Yup.number()
    .max(12, "12 is the highest month number.")
    .required("This field is required if filtering by date."),
  startDay: Yup.number()
    .max(31, "31 is the highest day number.")
    .required("This field is required if filtering by date."),
  startYear: Yup.number()
    .max(9999, "Years must be 4 digits.")
    .required("This field is required if filtering by date."),
  endMonth: Yup.number()
    .max(12, "12 is the highest month number.")
    .required("This field is required if filtering by date."),
  endDay: Yup.number()
    .max(31, "31 is the highest day number.")
    .required("This field is required if filtering by date."),
  endYear: Yup.number()
    .max(9999, "Years must be 4 digits.")
    .required("This field is required if filtering by date."),
});

const tagInitial = {
  tagInput: "",
  tags: [],
};

interface FilterModalProps {
  setStories: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  setFilter: React.Dispatch<React.SetStateAction<string | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function FilterModal({
  setStories,
  setFilter,
  setFilterOpen,
  setError,
}: FilterModalProps) {
  const handleDateSubmit = async (values: any, actions: FormikHelpers<any>) => {
    const {
      startMonth,
      startDay,
      startYear,
      endMonth,
      endDay,
      endYear,
    } = values;
    const startDate = new Date(`${startMonth}/${startDay}/${startYear}`);
    const endDate = new Date(`${endMonth}/${endDay}/${endYear}`);
    const filteredArticles = await fetchArticlesBetween(startDate, endDate);

    if (filteredArticles) {
      setStories(filteredArticles);
      setFilter(
        `Filtered from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`
      );
      setFilterOpen(false);
    } else {
      setError(
        "Error filtering stories. Make sure you've entered the dates correctly and try again."
      );
      setFilterOpen(false);
    }
  };

  const handleTagSubmit = async (values: any, actions: FormikHelpers<any>) => {
    const tags: string[] = values.tags;
    const filteredArticles = await fetchArticlesWithTags(tags);
    if (filteredArticles) {
      setStories(filteredArticles);
      setFilter(
        `Filtered by tags: "${tags.reduce(
          (prev, curr) => `${prev}, ${curr}`
        )}".`
      );
      setFilterOpen(false);
    } else {
      setError("Error filtering stories. Please try again.");
      setFilterOpen(false);
    }
  };

  return (
    <div className="flex flex-col tablet:p-5 items-start space-y-3 text-white">
      <ModalHeader text="Filter by Date:" />
      <p className="italic">Please enter dates in MM/DD/YYYY format.</p>

      <Formik
        initialValues={dateInitial}
        onSubmit={handleDateSubmit}
        validationSchema={dateSchema}
      >
        <Form>
          <h2 className="text-xl  uppercase font-bold">Start Date:</h2>
          <div className="flex flex-col tablet:flex-row items-start space-x-2 mb-5">
            <InputBundle name="startMonth" type="number" label="Month" />
            <InputBundle name="startDay" type="number" label="Day" />
            <InputBundle name="startYear" type="number" label="Year" />
          </div>

          <h2 className="text-xl  uppercase font-bold">End Date:</h2>
          <div className="flex flex-col tablet:flex-row items-start space-x-2 mb-5">
            <InputBundle name="endMonth" type="number" label="Month" />
            <InputBundle name="endDay" type="number" label="Day" />
            <InputBundle name="endYear" type="number" label="Year" />
          </div>

          <div className="flex mb-5 space-x-3">
            <button
              className="bg-white rounded-md px-4 py-2 text-decaBlue uppercase tracking-wider"
              type="reset"
            >
              Clear
            </button>
            <button
              className="bg-decaBlue rounded-md px-4 py-2 text-white font-bold uppercase tracking-wider"
              type="submit"
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>

      <ModalHeader text="Filter by Tag:" />
      <Formik initialValues={tagInitial} onSubmit={handleTagSubmit}>
        {(values) => (
          <Form>
            <div className="flex space-x-3 items-end mb-3">
              <InputBundle name="tagInput" type="text" label="Tag" />
              <button
                className="bg-decaBlue px-4 py-2 rounded-full uppercase text-white"
                type="button"
                onClick={() =>
                  values.setFieldValue(
                    "tags",
                    addTag(values.values.tagInput, values.values.tags),
                    false
                  )
                }
              >
                Add
              </button>
            </div>

            {values.values.tags.length > 0 && (
              <div className="flex flex-wrap">
                {values.values.tags.map((tag, index) => (
                  <button
                    key={index}
                    className="bg-decaBlue rounded-sm text-white uppercase px-4 py-2 mr-3 my-2"
                    onClick={() =>
                      values.setFieldValue(
                        "tags",
                        removeTag(index, values.values.tags),
                        false
                      )
                    }
                    type="button"
                  >
                    {tag} <b className="text-red-500 font-bold">X</b>
                  </button>
                ))}
              </div>
            )}
            <button
              className="bg-decaBlue px-4 py-2 rounded-md uppercase font-bold mt-3"
              type="submit"
            >
              SUBMIT
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function addTag(name: string, tags: string[]) {
  const newTags = tags.slice();
  newTags.push(name.trim().toLowerCase());
  return newTags;
}

function removeTag(index: number, tags: string[]) {
  const newTags: string[] = [];
  for (let i = 0; i < tags.length; i++) {
    if (index !== i) newTags.push(tags[i]);
  }
  return newTags;
}

interface InputBundleProps {
  name: string;
  type: string;
  label: string;
}
function InputBundle({ name, label, type }: InputBundleProps) {
  const breakpoint = useBreakpoint();

  return (
    <div
      className={cn({
        "flex flex-col flex-1 items-start": true,
        "remove-margin": breakpoint === "phone",
      })}
    >
      <label className="uppercase tracking-wider" htmlFor={name}>
        {label}
      </label>
      <Field className="rounded-sm text-black " name={name} type={type} />
      <ErrorMessage
        name={name}
        render={(msg) => <p className="text-red-500 text-xs">{msg}</p>}
      />
    </div>
  );
}

interface ModalHeaderProps {
  text: string;
}
function ModalHeader({ text }: ModalHeaderProps) {
  return (
    <div className="">
      <h1 className="uppercase text-3xl font-bold">{text}</h1>
      <div className="bg-decaBlue rounded-full h-1 w-full" />
    </div>
  );
}
