import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { auth, generateUserDocument, signInWithGoogle } from '../firebase';
import Styles from '../Styles/SignInPage.module.css';

const SignUp = () => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);

  const redirect = location.state && location.state.from ? location.state.from : '/';

  const createUserWithEmailAndPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      generateUserDocument(user, { displayName });
      history.push(redirect);
    }
    catch (error) {
      setError(error);
      setPassword('');
    }

    setEmail('');
    setDisplayName('');
  };

  const signInWithGoogleHandler = () => {
    signInWithGoogle()
      .then((result) => {
        history.push(redirect);
      })
      .catch((error) => {
        setError(error);
      })
  }

  return (
    <div className={Styles.loginContainer}>
      <h1>Sign Up</h1>
      {error && (<p className={Styles.error}>{error.code}<br />{error.message}</p>)}
      <form className={Styles.form} onSubmit={createUserWithEmailAndPasswordHandler}>
        <label htmlFor="displayName" className="block">
          Display Name:
        </label>
        <input
          type="text"
          name="displayName"
          value={displayName}
          placeholder="E.g: Faruq"
          id="displayName"
          onChange={event => setDisplayName(event.target.value)}
        />
        <label htmlFor="userEmail" className="block">
          Email:
        </label>
        <input
          type="email"
          name="userEmail"
          value={email}
          placeholder="E.g: faruq123@gmail.com"
          id="userEmail"
          onChange={event => setEmail(event.target.value)}
        />
        <label htmlFor="userPassword" className="block">
          Password:
        </label>
        <input
          type="password"
          name="userPassword"
          value={password}
          placeholder="Your Password"
          id="userPassword"
          onChange={event => setPassword(event.target.value)}
        />
        <button
          type="submit"
        >
          Sign up
        </button>
      </form>
      <p>OR</p>
      <button onClick={() => signInWithGoogleHandler()}>
        Sign In with Google
      </button>
      <p>
        Already have an account?{" "}
        <Link to="/signin">
          Sign in here
        </Link>
      </p>
    </div>
  );
};
export default SignUp;
