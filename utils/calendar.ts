import firebase from "firebase";
import fire from "./firebase";
const db = fire.firestore();

interface CalendarEventInit {
  id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  multiDay?: boolean;
  description: string;
}

export class CalendarEvent {
  id: string | null;
  title: string;
  startDate: Date;
  endDate: Date;
  multiDay: boolean;
  description: string;
  constructor({
    id,
    title,
    startDate,
    endDate,
    multiDay,
    description,
  }: CalendarEventInit) {
    this.id = id ? id : null;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.multiDay = multiDay ? multiDay : false;
    this.description = description;
  }

  toString() {
    return `Calendar Event ${
      this.title
    }. Begins on ${this.startDate.toLocaleString()}. Ends on ${this.endDate.toLocaleString()}.`;
  }
}

const calendarConverter = {
  toFirestore: (event: CalendarEvent) => ({
    title: event.title,
    startDate: firebase.firestore.Timestamp.fromDate(event.startDate),
    endDate: firebase.firestore.Timestamp.fromDate(event.endDate),
    multiDay: event.multiDay,
    description: event.description,
  }),
  fromFirestore: (
    snapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
    options: firebase.firestore.SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    if (data) {
      return new CalendarEvent({
        id: snapshot.id,
        title: data.title,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        multiDay: data.multiDay,
        description: data.description,
      });
    } else {
      throw Error("Error converting from firestore to calendar event object");
    }
  },
};

export async function createEvent(event: CalendarEvent) {
  try {
    await db.collection("events").withConverter(calendarConverter).add(event);
    return "Success";
  } catch (e) {
    console.log("Error creating the calendar event.");
    return "Error";
  }
}
