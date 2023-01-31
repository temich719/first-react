import React from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { auth, storage, db } from "../firebase";
import { getStorage, ref, uploadString } from "firebase/storage";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

export const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [showEmodji, setShowEmodji] = useState(false);

  const onEmojiClick = (emoji) => {
    addEmodji(emoji);
  };

  const handleSend = async () => {

    if(image === null && text === "") return;

    if (image) {
      const storageRef = ref(storage, uuid());

      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              image: downloadURL,
            }),
          });
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "usersChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "usersChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImage(null);
  };

  const addEmodji = (emoji) => {
    setText(text + emoji.emoji);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onKeyDown={(e) => {
          e.code === "Enter" && handleSend();
        }}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

      <button
        id="emojiButton"
        onClick={() => {
          setShowEmodji(!showEmodji);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {showEmodji && (
        <div className="picker">
          <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} native />
        </div>
      )}

      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
