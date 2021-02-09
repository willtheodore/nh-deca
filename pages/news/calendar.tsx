import Head from "next/head";
import * as React from "react";
import Modal from "react-responsive-modal";
import DisplayModal from "../../components/calendar/displayModal";
import CalendarDisplay from "../../components/calendar/calendarDisplay";
import Layout from "../../components/layout";
import { CalendarEvent } from "../../utils/calendar";

export default function Calendar() {
  const [display, setDisplay] = React.useState<CalendarEvent | null>(null);

  return (
    <>
      <Head>
        <title>NH DECA Calendar</title>
      </Head>

      {display && (
        <Modal open={display !== null} onClose={() => setDisplay(null)} center>
          <DisplayModal event={display} />
        </Modal>
      )}

      <Layout home="/images/highlight4.jpg" title="Calendar">
        <div className="mx-2 tablet:mx-5 pt-10 mb-20">
          <CalendarDisplay edit={false} setDisplay={setDisplay} />
        </div>
      </Layout>
    </>
  );
}
