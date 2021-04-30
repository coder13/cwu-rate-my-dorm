import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from '../firebase';
import Styles from '../Styles/SignInPage.module.css';

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);

  const sendResetEmail = event => {
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => { setEmailHasBeenSent(false) }, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };

  return (
    <div className={Styles.loginContainer}>
      <h1>
        Reset your Password
      </h1>
      <form className={Styles.form} onSubmit={sendResetEmail}>
        {emailHasBeenSent && (
          <p>
            An email has been sent to you!
          </p>
        )}
        {error && (<p className={Styles.error}>{error.code}<br />{error.message}</p>)}
        <label htmlFor="userEmail">
          Email:
        </label>
        <input
          type="email"
          name="userEmail"
          id="userEmail"
          value={email}
          placeholder="Input your email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit">
          Send me a reset link
        </button>
      </form>
      <Link
        to="/signin"
      >
        &larr; back to sign in page
      </Link>
    </div>
  );
};
export default PasswordReset;