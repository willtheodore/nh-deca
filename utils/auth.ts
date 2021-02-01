import { createContext } from "react";
import firebase from "firebase";
import fire from "./firebase";
const auth = fire.auth();

export const AuthContext = createContext<User | null>(null);
export const AuthProvider = AuthContext.Provider;

export const createUser = async (username: string, password: string) => {
  try {
    await auth.createUserWithEmailAndPassword(username, password);
  } catch (e) {
    console.log(e);
  }
};

export const signInUser = async (username: string, password: string) => {
  try {
    await auth.signInWithEmailAndPassword(username, password);
  } catch (e) {
    console.log(e);
  }
};

export type User = firebase.User;

export const initializeAuthState = (
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>
) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });
};
