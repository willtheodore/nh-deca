import * as React from "react";
import * as Yup from "yup";
import styles from "./signIn.module.css";
import AdminLayout from "./adminLayout";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikValues,
} from "formik";

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
  username: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Username must be 2-20 characters.")
    .max(20, "Username must be 2-20 characters.")
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
    username: "",
    password: "",
  };

  const handleSubmit = async (
    values: SignInValues,
    actions: FormikHelpers<SignInValues>
  ) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={SignInSchema}
    >
      <Form className={styles.form}>
        <FieldBundle name="username" label="Username" type="text" />
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
  username: string;
  confirmUsername: string;
  password: string;
  confirmPassword: string;
  accountCreationCode: string;
}

const CreateSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Username must be 2-20 characters.")
    .max(20, "Username must be 2-20 characters.")
    .matches(/^\S*$/, "No spaces are permitted.")
    .required("This field is required."),
  confirmUsername: Yup.string()
    .oneOf([Yup.ref("username"), null], "Usernames must match.")
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
    username: "",
    confirmUsername: "",
    password: "",
    confirmPassword: "",
    accountCreationCode: "",
  };

  const handleSubmit = async (
    values: CreateValues,
    actions: FormikHelpers<CreateValues>
  ) => {
    const { username, password, accountCreationCode } = values;
    console.log(values);
    actions.setFieldError("accountCreationCode", "Incorrect code.");
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={CreateSchema}
    >
      <Form className={styles.form}>
        <FieldBundle name="username" label="Username" type="text" />
        <FieldBundle
          name="confirmUsername"
          label="Confirm Username"
          type="text"
        />
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
