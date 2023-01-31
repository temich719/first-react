import React from "react";
import { useContext, useState, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

export const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    const unsubscribe = () => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    };
    return () => {
      unsubscribe();
    };
  }, [message]);

  console.log(message.date.toDate());

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{`${message.date.toDate().getHours()}:${
          message.date.toDate().getMinutes() < 10
            ? "0" + message.date.toDate().getMinutes()
            : message.date.toDate().getMinutes()
        }`}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.image && <img src={message.image} alt="" />}
      </div>
    </div>
  );
};
