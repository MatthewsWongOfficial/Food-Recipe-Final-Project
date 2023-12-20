import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Handle successful Google sign-in
    } catch (error) {
      // Handle errors
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login (e.g., redirect to home page)
    } catch (error) {
      // Handle errors (e.g., display error message)
      console.error("Error signing in with email and password", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Sign In</button>

        <button onClick={handleSignInWithGoogle}>Sign In with Google</button>
      </form>
    </div>
  );
};

export default SignIn;
