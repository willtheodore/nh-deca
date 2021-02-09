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

interface EventResult {
  [key: number]: CalendarEvent[];
}
export async function getEventsInMonth(year: number, month: number) {
  try {
    const sDate = new Date(year, month);
    const eDate = new Date(year, month + 1);
    const startingEvents = convertToArray(
      await db
        .collection("events")
        .where("startDate", ">=", firebase.firestore.Timestamp.fromDate(sDate))
        .where("startDate", "<=", firebase.firestore.Timestamp.fromDate(eDate))
        .withConverter(calendarConverter)
        .get()
    );
    const endingEvents = convertToArray(
      await db
        .collection("events")
        .where("endDate", ">=", firebase.firestore.Timestamp.fromDate(sDate))
        .where("endDate", "<=", firebase.firestore.Timestamp.fromDate(eDate))
        .withConverter(calendarConverter)
        .get()
    );
    const events = merge(startingEvents, endingEvents);

    const res: EventResult = {};
    for (const event of events) {
      const startDay = event.startDate.getDate();
      if (res[startDay] === undefined) {
        const arr = [];
        arr.push(event);
        res[startDay] = arr;
      } else {
        const arr = res[startDay];
        arr.push(event);
        res[startDay] = arr;
      }
    }
    return res;
  } catch (e) {
    console.log("Error getting events within month", e);
  }
}

export async function deleteEvent(event: CalendarEvent) {
  try {
    if (event.id) {
      await db.collection("events").doc(event.id).delete();
      return "Success";
    }
    return "Error";
  } catch (e) {
    console.log("Error deleting the event", e);
    return "Error";
  }
}

export async function updateEvent(event: CalendarEvent) {
  try {
    if (!event.id) throw Error("No Event ID");
    await db
      .collection("events")
      .doc(event.id)
      .withConverter(calendarConverter)
      .set(event);
    return "Success";
  } catch (e) {
    console.log("Error updating the event", e);
    return "Error";
  }
}

function convertToArray(
  events: firebase.firestore.QuerySnapshot<CalendarEvent>
) {
  const arr: CalendarEvent[] = [];
  events.forEach((event) => arr.push(event.data()));
  return arr;
}

function merge(a1: CalendarEvent[], a2: CalendarEvent[]) {
  const res = a1.slice();
  for (const event of a2) {
    if (!containsID(a1, event.id!)) res.push(event);
  }
  return res;
}

function containsID(arr: CalendarEvent[], id: string) {
  for (const event of arr) {
    if (event.id === id) return true;
  }
  return false;
}
