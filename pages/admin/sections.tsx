import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";
import cn from "classnames";
import {
  addPageToSection,
  getSections,
  Page,
  removePageAtIndex,
  Section,
  swapPages,
} from "../../utils/firestore";
import { Field, Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import Head from "next/head";

const schema = Yup.object().shape({
  label: Yup.string().required("Field is required"),
});

export default function Sections() {
  const [activeSection, setActiveSection] = React.useState<number>(0);
  const [pages, setPages] = React.useState<Page[] | null>(null);
  const [sections, setSections] = React.useState<Section[] | null>(null);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const res = await getSections();
    if (res) {
      setSections(res);
    }
  };

  React.useEffect(() => {
    if (sections) {
      const p = getPages(sections[activeSection]);
      setPages(p);
    }
  }, [activeSection]);

  const handleAdd = async (values: FormikValues) => {
    if (pages) {
      const newPageLabel = values.label;
      await addPageToSection(
        ["about", "conferences", "members"][activeSection],
        newPageLabel,
        pages.length
      );
      setDone(true);
    }
  };

  const swap = async (index1: number, index2: number) => {
    if (pages && sections) {
      await swapPages(
        ["about", "conferences", "members"][activeSection],
        sections[activeSection],
        index1,
        index2
      );
      setDone(true);
    }
  };

  const remove = async (index: number) => {
    if (pages && sections) {
      await removePageAtIndex(
        ["about", "conferences", "members"][activeSection],
        sections[activeSection],
        index
      );
      setDone(true);
    }
  };

  if (done) {
    return (
      <>
        <Head>
          <title>Admin - Manage the Pages and Sections</title>
        </Head>
        <AdminLayout>
          <>
            <h1 className="text-4xl uppercase text-white font-semibold pt-5">
              Edit Sections
            </h1>
            <p className="text-white">Refresh page to see changes</p>
          </>
        </AdminLayout>
      </>
    );
  }

  return (
    sections && (
      <>
        <Head>
          <title>Admin - Manage the Pages and Sections</title>
        </Head>
        <AdminLayout>
          <>
            <h1 className="text-4xl uppercase text-white font-semibold pt-5">
              Edit Sections
            </h1>
            <div className="bg-white my-5">
              {["About", "Conferences", "Members"].map((title, index) => (
                <button
                  key={index}
                  className={cn({
                    "text-center px-4 py-2 uppercase": true,
                    "bg-blue-300": activeSection === index,
                  })}
                  onClick={() => setActiveSection(index)}
                >
                  {title}
                </button>
              ))}
            </div>
            <div className="bg-white my-5 rounded-md flex flex-col divide-y-2">
              {pages &&
                pages.map((page, index) => (
                  <div
                    className="flex justify-between items-center p-2"
                    key={index}
                  >
                    <p>{page.label}</p>
                    <div className="flex space-x-2 text-white">
                      {index > 0 && (
                        <button
                          className="bg-decaBlue hover:bg-blue-700 transition duration-300 rounded-full p-2"
                          onClick={() => swap(index, index - 1)}
                        >
                          ↑
                        </button>
                      )}
                      {index < getPages(sections[activeSection]).length - 1 && (
                        <button
                          className="bg-decaBlue hover:bg-blue-700 transition duration-300 rounded-full p-2"
                          onClick={() => swap(index, index + 1)}
                        >
                          ↓
                        </button>
                      )}
                      <button
                        className="bg-red-400 hover:bg-red-600 uppercase px-4 py-2 transition duration-300"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              <Formik
                initialValues={{ label: "" }}
                onSubmit={handleAdd}
                validationSchema={schema}
              >
                <Form className="text-white flex justify-between p-2">
                  <Field
                    name="label"
                    type="text"
                    className="rounded-md w-80 text-black"
                  />
                  <button className="bg-decaBlue p-2 rounded-full uppercase">
                    Add
                  </button>
                </Form>
              </Formik>
            </div>
          </>
        </AdminLayout>
      </>
    )
  );
}

const getPages = (section: Section) => {
  let pages = [];
  for (const page in section) {
    pages.push(section[page]);
  }
  pages = pages.sort((p1, p2) => p1.index - p2.index);
  return pages;
};
