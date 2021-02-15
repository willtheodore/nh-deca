import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import * as React from "react";
import * as Yup from "yup";
import AdminLayout from "../../components/admin/adminLayout";
import Error from "../../components/error";
import { getValidationCode, setValidationCode } from "../../utils/firestore";

const schema = Yup.object().shape({
  code: Yup.string().required("This field is required"),
});

export default function AdminCode() {
  const [code, setCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchCode();
  }, []);
  const fetchCode = async () => {
    const res = await getValidationCode();
    if (res) setCode(res);
    else setError("Error fetching the code. Please try again.");
  };

  const handleSubmit = async (values: { code: string }) => {
    const { code } = values;
    const res = await setValidationCode(code.trim());
    if (res === "Success")
      setSuccess("Success updating admin code. Refresh to dismiss.");
    else setError("Error updating admin code.");
  };

  return (
    <>
      <Head>
        <title>Admin - Mange the NH DECA admin code</title>
      </Head>

      <AdminLayout>
        <div className="pt-10">
          <h1 className="text-3xl text-white uppercase font-bold">
            Admin Code
          </h1>
          <p className="text-lg text-white">
            This code is required when creating an admin account. Without it, an
            admin account cannot be created. Think of it like the "password" for
            managing content on the site.
          </p>

          {error && <Error message={error} onClick={() => setError(null)} />}
          {!error && success && (
            <p className="text-4xl text-center w-full text-green-500 font-bold mt-3">
              {success}
            </p>
          )}

          {!error && !success && code && (
            <>
              <p className="text-white my-3 italic">
                {"Current code: " + code}
              </p>

              <Formik
                initialValues={{ code: code }}
                onSubmit={handleSubmit}
                validationSchema={schema}
              >
                <Form className="flex space-x-3">
                  <Field name="code" className="p-3 rounded-md" />
                  <ErrorMessage name="code" />
                  <button type="submit" className="blue-rounded">
                    Commit new code
                  </button>
                </Form>
              </Formik>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
