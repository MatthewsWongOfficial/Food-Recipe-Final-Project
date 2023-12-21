import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { auth } from '../firebase'; // Adjust the path as necessary
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import googleLogo from '../assets/google.png'; // Import the Google logo

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUpWithEmail = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error("Error signing up with email and password", error);
    }
  };

  const handleSignUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error("Error signing up with Google", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center bg-white">
        <div className="col-md-6">
          <form className="sign-form" onSubmit={handleSignUpWithEmail}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign Up with Email
            </button>

            <div className="text-center mt-3">
              <button
                onClick={handleSignUpWithGoogle}
                className="btn btn-danger btn-block rounded-circle"
                style={{
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',
                }}
              >
                <img
                  src={googleLogo}
                  alt="Google Logo"
                  className="google-logo img-fluid"
                  style={{ maxWidth: '30px', maxHeight: '30px' }}
                />
              </button>
              <p className="mt-2">Or sign up with Google</p>
            </div>

            {/* Sign in message with red-colored link */}
            <div className="text-center mt-3">
              <span>Have an account? </span>
              <Link to="/signin" style={{ color: 'red' }}>Sign in Here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
