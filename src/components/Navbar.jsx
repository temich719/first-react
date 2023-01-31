import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { storage, db } from "../firebase";
import { ref } from "firebase/storage";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { async } from "@firebase/util";

export const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);

  const handleNewAvatar = async (image) => {
    const storageRef = ref(storage, uuid());

    await uploadBytesResumable(storageRef, image).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        await updateDoc(doc(db, "users", currentUser.uid), {
          photoURL: downloadURL,
        });
        setImage(downloadURL);
      });
    });
  };

  return (
    <div className="navbar">
      <span className="logo">Temich App</span>
      <div className="user">
        <label>
          {image && <img src={image} alt="" />}
          {!image && <img src={currentUser.photoURL} alt="" />}
          <input
            type="file"
            hidden
            onChange={(e) => handleNewAvatar(e.target.files[0])}
          />
        </label>
        <span>{currentUser.displayName}</span>
        <button
          onClick={() => {
            signOut(auth);
          }}
        >
          logout
        </button>
      </div>
    </div>
  );
};
