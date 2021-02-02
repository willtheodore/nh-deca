import * as React from "react";
import * as Yup from "yup";
import styles from "./admin.module.css";
import AdminLayout from "./adminLayout";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { getValidationCode } from "../../utils/firestore";
import { createUser, signInUser } from "../../utils/auth";

export default function SignIn() {
  const [mode, setMode] = React.useState<"signIn" | "create">("signIn");

  return (
    <AdminLayout>
      <div className={styles.wrapper}>
        <h1 className={styles.header}>
          {mode === "signIn" ? "Admin Login" : "Create An Account"}
        </h1>
        <div className={styles.box}>
          {mode === "signIn" ? (
            <SignInForm setMode={setMode} />
          ) : (
            <CreateForm setMode={setMode} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

interface FieldBundleProps {
  name: string;
  type: string;
  label: string;
}

function FieldBundle({ name, type, label }: FieldBundleProps) {
  return (
    <>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <Field className={styles.field} type={type} name={name} />
      <ErrorMessage
        name={name}
        render={(msg) => <p className={styles.error}>{msg}</p>}
      />
    </>
  );
}

interface SignInFormProps {
  setMode: React.Dispatch<React.SetStateAction<"signIn" | "create">>;
}

interface SignInValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .min(2, "Email must be >2 characters.")
    .matches(/^\S*$/, "No spaces are permitted.")
    .required("This field is required."),
  password: Yup.string()
    .min(2, "Password must be 2-20 characters.")
    .max(20, "Password must be 2-20 characters.")
    .matches(/^\S*$/, "No spaces are permitted.")
    .required("This field is required."),
});

function SignInForm({ setMode }: SignInFormProps) {
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: SignInValues,
    actions: FormikHelpers<SignInValues>
  ) => {
    const { email, password } = values;
    const res = await signInUser(email, password);
    if (res === "Error") {
      actions.resetForm();
      actions.setFieldError(
        password,
        "Error Signing in. Please check credentials + try again."
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={SignInSchema}
    >
      <Form className={styles.form}>
        <FieldBundle name="email" label="Email" type="email" />
        <FieldBundle name="password" label="Password" type="password" />

        <div className={styles.buttons}>
          <button className={styles.blue} type="submit">
            Submit
          </button>
          <button className={styles.clear} onClick={() => setMode("create")}>
            Create
          </button>
        </div>
      </Form>
    </Formik>
  );
}

interface CreateFormProps {
  setMode: React.Dispatch<React.SetStateAction<"signIn" | "create">>;
}

interface CreateValues {
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  accountCreationCode: string;
}

const CreateSchema = Yup.object().shape({
  email: Yup.string()
    .min(2, "Email must be >2 characters.")
    .matches(/^\S*$/, "No spaces are permitted.")
    .required("This field is required."),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref("email"), null], "Emails must match.")
    .matches(/^\S*$/, "No spaces are permitted.")
    .required("This field is required."),
  password: Yup.string()
    .min(2, "Password must be 2-20 characters.")
    .max(20, "Password must be 2-20 characters.")
    .matches(/^\S*$/, "No spaces are permitted.")
    .required("This field is required."),
  confirmPassword: Yup.string()
    .matches(/^\S*$/, "No spaces are permitted.")
    .oneOf([Yup.ref("password"), null], "Passwords must match.")
    .required("This field is required."),
  accountCreationCode: Yup.string()
    .matches(/^\S*$/, "No spaces are permitted.")
    .required("This field is required."),
});

function CreateForm({ setMode }: CreateFormProps) {
  const initialValues = {
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    accountCreationCode: "",
  };

  const handleSubmit = async (
    values: CreateValues,
    actions: FormikHelpers<CreateValues>
  ) => {
    const { email, password, accountCreationCode } = values;
    const code = await getValidationCode();
    if (code !== accountCreationCode) {
      actions.setFieldError("accountCreationCode", "Incorrect code.");
    } else {
      const res = await createUser(email, password);
      if (res === "Error") {
        actions.resetForm();
        actions.setFieldError(
          password,
          "Error Creating an account. Please try again."
        );
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={CreateSchema}
    >
      <Form className={styles.form}>
        <FieldBundle name="email" label="Email" type="email" />
        <FieldBundle name="confirmEmail" label="Confirm Email" type="email" />
        <FieldBundle name="password" label="Password" type="password" />
        <FieldBundle
          name="confirmPassword"
          label="Confirm Password"
          type="password"
        />
        <FieldBundle
          name="accountCreationCode"
          label="Account Creation Code"
          type="text"
        />

        <div className={styles.buttons}>
          <button className={styles.blue} type="submit">
            Submit
          </button>
          <button className={styles.clear} onClick={() => setMode("signIn")}>
            {"< Back"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
