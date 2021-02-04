import { Field, Form, Formik } from "formik";
import * as React from "react";
import { getHomeContent, updateHomeContent } from "../../utils/firestore";

interface InitialValues {
  bannerTitle: string;
  bannerContent: string;
}

export default function HomeEditor() {
  const [
    initialValues,
    setInitialValues,
  ] = React.useState<InitialValues | null>(null);

  React.useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const content = await getHomeContent();
    if (content) {
      setInitialValues({
        bannerTitle: content.banner.title,
        bannerContent: content.banner.content,
      });
    }
  };

  const handleSubmit = async (values: InitialValues) => {
    setInitialValues(null);
    const { bannerTitle, bannerContent } = values;
    await updateHomeContent(bannerTitle, bannerContent);
    init();
  };

  return (
    initialValues && (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form className="flex flex-col items-start">
          <h1 className="text-3xl uppercase font-bold mt-3">Banner</h1>

          <label htmlFor="bannerTitle" className="mt-2">
            Title
          </label>
          <Field
            name="bannerTitle"
            className="rounded-md w-80 mt-1 text-black"
            type="text"
          />

          <label htmlFor="bannerContent" className="mt-5">
            Content
          </label>
          <Field
            name="bannerContent"
            as="textarea"
            className="rounded-md mt-1 w-full text-black"
            type="text"
          />

          <button
            className="bg-decaBlue uppercase tracking-wider px-4 py-2 rounded-md mt-5"
            type="submit"
          >
            Commit Changes
          </button>
        </Form>
      </Formik>
    )
  );
}
