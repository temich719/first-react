import React from 'react'
import AddAvatar from '../img/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth, storage, db} from '../firebase';
import { useState } from 'react';
import { getStorage, ref, uploadString } from "firebase/storage";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, Timestamp } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
          } catch (err) {
            console.log(err);
            setErr(true);
          }
        });
      });

      await setDoc(doc(db, "usersChats", res.user.uid), {});

      navigate("/");

    } catch(err) {
      setErr(true);
    }
    
  }

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className="logo">Temich App</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='display name'/>
                <input type="email" placeholder='email'/>
                <input type="password" placeholder='password'/>
                <input style={{display: "none"}} type="file" id='file'/>
                <label htmlFor="file">
                    <img src={AddAvatar} alt="addAvatar" />
                    <span>Add an avatar</span>
                </label>
                <button>Sign up</button>
                {err && <span>Something went wrong!</span>}
            </form>
            <p>You do have account? <Link to="/login">Login</Link></p>
        </div>
    </div>
  )
}

export default Register