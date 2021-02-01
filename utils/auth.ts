import { createContext } from "react";
import firebase from "firebase";
import fire from "./firebase";
const auth = fire.auth();

export type User = firebase.User;
export const AuthContext = createContext<User | null>(null);
export const AuthProvider = AuthContext.Provider;

export const createUser = async (username: string, password: string) => {
  try {
    await auth.createUserWithEmailAndPassword(username, password);
    return "Success";
  } catch (e) {
    console.log("Error creating an account", e);
    return "Error";
  }
};

export const signInUser = async (username: string, password: string) => {
  try {
    await auth.signInWithEmailAndPassword(username, password);
    return "Success";
  } catch (e) {
    console.log("Error signing in", e);
    return "Error";
  }
};

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

export const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (e) {
    console.log("Error signing out");
  }
};
