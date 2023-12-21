import React, { useState } from 'react';
import { auth } from '../firebase'; // Adjust the path as necessary
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUpWithEmail = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Handle successful email/password registration
    } catch (error) {
      // Handle errors
      console.error("Error signing up with email and password", error);
    }
  };

  const handleSignUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Handle successful Google sign-up
    } catch (error) {
      // Handle errors
      console.error("Error signing up with Google", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUpWithEmail}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
  
        <div className="button-container">
          <button type="submit">Sign Up with Email</button>
          <button onClick={handleSignUpWithGoogle}>Sign Up with Google</button>
        </div>
      </form>
    </div>
  );  
};

export default SignUp;
