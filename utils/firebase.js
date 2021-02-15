import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCoMOIGr5px4OPT32HKRVebz3AC-Q0nTcY",
  authDomain: "nh-deca.firebaseapp.com",
  projectId: "nh-deca",
  storageBucket: "nh-deca.appspot.com",
  messagingSenderId: "886798360749",
  appId: "1:886798360749:web:3fd61d19bb273d4542a624",
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

const fire = firebase;
export default fire;
