import React from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    setErr(false);
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    setUser(null);
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
      } else {
        querySnapshot.forEach((doc) => {
          console.log("searcj comnp: " + doc.data());
          setUser(doc.data());
        });
      }
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    dispatch({ type: "CHANGE_USER", payload: user });
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "usersChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "usersChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
    document.getElementById("searchInput").value = "";
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          id="searchInput"
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      {err && <span className="userNotFound">User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
