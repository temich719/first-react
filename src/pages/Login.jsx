import React from "react";
import { auth, storage, db } from "../firebase";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const sighInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        const imageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCwYiBU1phLjFdjjYtVQ4AV5R8-RTL3OzwLpePWuRG8xpcOx5KF_QQi9IH66o9F8HK0I&usqp=CAU";

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: imageURL,
        });
        navigate("/");
        await setDoc(doc(db, "usersChats", user.uid), {});
      })
      .catch((err) => {
        setErr(true);
      });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Temich App</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span>Something went wrong!</span>}
          <p className="sighInWithGoogle" onClick={sighInWithGoogle}>Sign in with Google</p>
        </form>
        <p>
          You don't have account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
