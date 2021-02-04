import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  useField,
  useFormikContext,
} from "formik";
import * as React from "react";
import styles from "./pageEditor.module.css";
import {
  getContentBySlug,
  PageContent,
  updatePageContent,
} from "../../utils/firestore";
import HomeEditor from "./homeEditor";

interface PageEditorProps {
  slug: string;
}

interface PageEditorValues {
  title: string;
  slug: string;
  heroURL: string | null;
  files: string[];
  content: string;
}

export default function PageEditor({ slug }: PageEditorProps) {
  const [initialValues, setInitialValues] = React.useState<PageContent | null>(
    null
  );
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (slug.split("\\")[0] !== "news" && slug !== "home") {
      getContent();
    }
  }, [slug]);
  const getContent = async () => {
    const res = await getContentBySlug(slug);
    if (res) {
      setInitialValues(null);
      setInitialValues({
        title: res.title,
        slug: res.slug,
        heroURL: res.heroURL ? res.heroURL : null,
        files: res.files ? res.files : [],
        content: res.content,
      });
    }
  };

  const handleSubmit = async (values: PageContent) => {
    setSubmitting(true);
    const { title, heroURL, content } = values;
    console.log(values);
    await updatePageContent(title, slug, heroURL, file, content);
    await getContent();
    setSubmitting(false);
  };

  return (
    <div className="w-full mt-5 mb-20">
      <hr className="w-full bg-white" />
      {initialValues !== null &&
        !submitting &&
        slug.split("\\")[0] !== "news" &&
        slug !== "home" && (
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form className="text-black flex flex-col space-y-2 items-start">
              <label htmlFor="title" className={styles.label}>
                Title
              </label>
              <p className={styles.helper}>
                This title will be displayed in the navigation, as well as on
                the page itself
              </p>
              <Field name="title" type="text" className={styles.field} />
              <ErrorMessage name="title" />

              <HeroInput name="heroURL" setFile={setFile} />

              <label htmlFor="content" className={styles.label}>
                Content
              </label>
              <p className={styles.helper}>
                All website content is written using a "psuedo-language" called
                Markdown. For more information on how to write Markdown,{" "}
                <a
                  href="https://www.markdownguide.org/basic-syntax/"
                  target="__blank"
                  className={styles.link}
                >
                  click here.
                </a>
                <br /> Tip: drag the bottom-right corner of the textbox to make
                it bigger.
              </p>
              <ErrorMessage name="content" />
              <Field name="content">
                {({ field }: FieldProps) => (
                  <textarea className={styles.textarea} {...field} />
                )}
              </Field>
              <button type="submit" className={styles.submit}>
                Commit Changes
              </button>
            </Form>
          </Formik>
        )}
      {slug === "home" && <HomeEditor />}
    </div>
  );
}

function HeroInput(props: any) {
  const {
    values: { heroURL },
  } = useFormikContext();
  const fieldProps = useField(props.name);
  const FieldHelperProps = fieldProps[2];
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current && inputRef.current.files?.length === 1) {
      props.setFile(inputRef.current.files[0]);
    }
  }, [inputRef.current?.files]);

  const handleRemove = () => {
    FieldHelperProps.setValue(null);
  };

  return (
    <>
      <label className={styles.label} htmlFor={props.name}>
        Hero Image
      </label>
      <p className={styles.helper}>
        Images should be png files and of a size that is less than 1 MB.
      </p>
      <div className="flex text-white items-center">
        <input
          type="file"
          id={props.name}
          ref={inputRef}
          accept="images/png"
          onChange={(event) =>
            FieldHelperProps.setValue(
              event.target.value.replace("C:\\fakepath\\", "")
            )
          }
        />
        <p className="-ml-5">
          Current file URL: <b>{heroURL ? heroURL : "NO IMAGE"}</b>
        </p>
        <button
          className="bg-red-400 rounded-md px-4 py-2 ml-5 hover:bg-red-600 transition duration-300"
          type="button"
          onClick={handleRemove}
        >
          Remove Hero image
        </button>
      </div>
    </>
  );
}
