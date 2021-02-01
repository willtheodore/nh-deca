import { Formik, FormikHelpers } from "formik";
import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";

interface PageValues {
  section: "About" | "Members" | "Conferences" | "News" | "Home";
  page: string;
}

export default function Pages() {
  const initialValues: PageValues = {
    section: "Home",
    page: "",
  };

  const handleSubmit = (
    values: PageValues,
    actions: FormikHelpers<PageValues>
  ) => {};

  return (
    <AdminLayout>
      <div className="text-white pt-10">
        <h1 className="uppercase font-bold text-3xl">Edit Pages</h1>
        <h2 className="text-lg">
          Pick a section. Then pick a page. Then edit in the window below to
          change the content! Some pages (like the home page) will have special
          fields (like the home banner) to edit specific content.
        </h2>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}></Formik>
      </div>
    </AdminLayout>
  );
}
