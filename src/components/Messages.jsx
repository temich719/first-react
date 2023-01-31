import React from "react";
import { Message } from "./Message";
import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase";


export const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unsubscribe();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message = {m} key={m.id}/>
      ))}
    </div>
  );
};
