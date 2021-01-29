import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
	apiKey: "AIzaSyA_7DVDQp-KeQb-IsugA2Zw4SoFmxCas2A",
	authDomain: "nh-deca.firebaseapp.com",
	projectId: "nh-deca",
	storageBucket: "nh-deca.appspot.com",
	messagingSenderId: "886798360749",
	appId: "1:886798360749:web:3fd61d19bb273d4542a624",
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
