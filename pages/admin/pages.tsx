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
import PageEditor from "../../components/admin/pageEditor";
import { getPagesBySection, Page } from "../../utils/firestore";

interface PageValues {
  section: "about" | "members" | "conferences" | "news" | "home";
  page: string;
}

export default function Pages() {
  const [editSlug, setEditSlug] = React.useState<string | null>(null);
  const [options, setOptions] = React.useState<Page[] | null>(null);

  const initialValues: PageValues = {
    section: "home",
    page: "",
  };

  const handleSubmit = (
    values: PageValues,
    actions: FormikHelpers<PageValues>
  ) => {
    setEditSlug(null);
    if (values.page !== "") {
      const slug = values.section.concat("\\".concat(values.page));
      setEditSlug(slug);
    } else if (values.section !== "home" && options && options[0].slug) {
      const slug = values.section.concat("\\".concat(options[0].slug));
      setEditSlug(slug);
    } else if (values.section === "home") {
      setEditSlug("home");
    }
  };

  return (
    <AdminLayout>
      <div className="text-white pt-10">
        <h1 className="uppercase font-bold text-3xl">Edit Pages</h1>
        <h2 className="text-lg">
          Pick a section. Then pick a page. Then edit in the window below to
          change the content! Some pages (like the home page) will have special
          fields (like the home banner) to edit specific content.
          <div className="pb-2" />
          Try not to refresh the page until you're done making changes. I
          recommend opening another tab with the page you are editing and
          refreshing that page after you make changes on this page. Use the
          "commit changes" button to save what you've wrote once you're done!
          <div className="pb-2" />
          ALWAYS REFRESH AFTER YOU COMMIT CHANGES. This will help prevent bugs.
        </h2>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form className="text-black mt-5 flex items-center">
            <Field
              as="select"
              name="section"
              className="rounded-md w-52 border-none"
            >
              <option value="about">About</option>
              <option value="members">Members</option>
              <option value="conferences">Conferences</option>
              <option value="news">News</option>
              <option value="home">Home</option>
            </Field>
            <PageSelectField
              name="page"
              className="rounded-md w-52 ml-5 border-none"
              options={options}
              setOptions={setOptions}
            />
            <button
              type="submit"
              className="px-6 py-2 ml-5 rounded-md font-bold uppercase tracking-wider bg-decaBlue hover:bg-blue-500 
                         transition duration-300 text-white"
            >
              Submit
            </button>
          </Form>
        </Formik>

        {editSlug && <PageEditor slug={editSlug} />}
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
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (section && section !== "home") {
      setLoading(true);
      getOptions();
    }
  }, [section, touched.section, props.name]);
  const getOptions = async () => {
    const sectionArray = await getPagesBySection(section);
    if (sectionArray) {
      props.setOptions(sectionArray);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <img className="animate-spin ml-2" src="/svg/cached.svg" alt="loading" />
    );

  if (props.options !== null && section !== "home")
    return (
      <select {...field} {...props}>
        {props.options.map((page: Page) => (
          <option key={page.slug} value={page.slug}>
            {page.label}
          </option>
        ))}
      </select>
    );

  return <></>;
}
