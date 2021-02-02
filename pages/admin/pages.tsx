import {
  Field,
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from "formik";
import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";
import { getPagesBySection, Page } from "../../utils/firestore";

interface PageValues {
  section: "about" | "members" | "conferences" | "news" | "home";
  page: string;
}

export default function Pages() {
  const initialValues: PageValues = {
    section: "home",
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

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form className="text-black mt-5">
            <Field as="select" name="section" className="rounded-md w-52">
              <option value="about">About</option>
              <option value="members">Members</option>
              <option value="conferences">Conferences</option>
              <option value="news">News</option>
              <option value="home">Home</option>
            </Field>
            <PageSelectField name="page" className="rounded-md w-52 ml-5" />
          </Form>
        </Formik>
      </div>
    </AdminLayout>
  );
}

function PageSelectField(props: any) {
  const {
    values: { section },
    touched,
  } = useFormikContext();
  const [field] = useField(props);
  const [options, setOptions] = React.useState<Page[] | null>(null);

  React.useEffect(() => {
    if (section && touched.section && section !== "home") {
      getOptions();
    }
  }, [section, touched.section, props.name]);
  const getOptions = async () => {
    const sectionArray = await getPagesBySection(section);
    if (sectionArray) {
      setOptions(sectionArray);
    }
  };

  if (options !== null && section !== "home")
    return (
      <select {...field} {...props}>
        {options.map((page, index) => (
          <option key={page.slug} value={page.slug}>
            {page.label}
          </option>
        ))}
      </select>
    );

  return <></>;
}
