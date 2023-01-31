import { createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { async } from "@firebase/util";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user != null) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          user.photoURL = doc.data().photoURL;
        });
      }
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
