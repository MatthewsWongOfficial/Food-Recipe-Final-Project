import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase'; // Adjust the path as necessary
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import googleLogo from '../assets/google.png'; // Import the Google logo, adjust path as necessary

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignInWithEmail = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error("Error signing in with email and password", error);
    }
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center bg-white">
        <div className="col-md-6">
          <form className="sign-form" onSubmit={handleSignInWithEmail}>
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
              Sign In with Email
            </button>

            <div className="text-center mt-3">
              <button
                onClick={handleSignInWithGoogle}
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
              <p className="mt-2">Or sign in with Google</p>
            </div>
          </form>

          <div className="text-center mt-4">
            <span>Or if you don't have an account, please </span>
            <Link to="/signup" style={{ color: 'red' }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
