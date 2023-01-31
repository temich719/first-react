import React from "react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, storage, db } from "../firebase";

export const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {

    console.log("id: " + currentUser.uid);

    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "usersChats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };
    console.log("Curr:" + currentUser.uid);

    currentUser.uid && getChats();
    console.log("cg: " + chats);
  }, [currentUser.uid]);

  //console.log(Object.entries(chats));

  const handleSelect = (user) => {
    console.log("dispatch: " + user);
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo?.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo?.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
        {/*<div className="settings">⚙️</div>*/}
    </div>
  );
};
