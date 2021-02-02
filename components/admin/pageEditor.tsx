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

interface PageEditorProps {
  slug: string;
}

export default function PageEditor({ slug }: PageEditorProps) {
  const [pageContent, setPageContent] = React.useState<PageContent | null>(
    null
  );
  const [file, setFile] = React.useState<FileList | null>(null);
  const [attachedFiles, setAttachedFiles] = React.useState<FileList | null>(
    null
  );
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (slug.split("\\")[0] !== "news" && slug !== "home") {
      getContent();
    }
  }, [slug]);
  const getContent = async () => {
    const res = await getContentBySlug(slug);
    if (res) {
      setPageContent(null);
      setPageContent(res);
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
      {pageContent !== null &&
        !submitting &&
        slug.split("\\")[0] !== "news" &&
        slug !== "home" && (
          <Formik initialValues={pageContent} onSubmit={handleSubmit}>
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

              <FileInput name="files" setFiles={setAttachedFiles} />

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
    </div>
  );
}

function FileInput(props: any) {
  const {
    values: { files },
  } = useFormikContext();
  const fieldProps = useField(props.name);
  const FieldHelperProps = fieldProps[2];
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <label className={styles.label} htmlFor={props.name}>
        Attached Files
      </label>
      <p className={styles.helper}>
        You can upload any kind of file here. They will be attached at the
        bottom of the page. Be careful before clicking the remove files button,
        as this will remove all files uploaded to the page. You can use CMD +
        click on Mac or ALT + click (I think) on Windows to select multiple
        files.
      </p>
      <div className="flex text-white items-center">
        <input
          type="file"
          id={props.name}
          ref={inputRef}
          multiple
          onChange={() => FieldHelperProps.setValue(inputRef.current?.files)}
        />
        <p className="-ml-5">
          Current files selected:{" "}
          <b>{files ? `${files.length} files` : "NO FILES"}</b>
        </p>
        <button
          className="bg-red-400 rounded-md px-4 py-2 ml-5 hover:bg-red-600 transition duration-300"
          type="button"
          onClick={() => FieldHelperProps.setValue(null)}
        >
          Remove All Files
        </button>
      </div>
    </>
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
    if (inputRef.current) {
      props.setFile(inputRef.current.files);
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
