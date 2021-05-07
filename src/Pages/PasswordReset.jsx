import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Form, Button } from 'react-bootstrap';
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
      .catch((e) => {
        setError(e);
      });
  };

  return (
    <div className={Styles.loginContainer}>
      <h1>
        Reset your Password
      </h1>
      <Form className={Styles.form} onSubmit={sendResetEmail}>
        {emailHasBeenSent && (
          <Alert variant="success" dismissible onClose={() => setEmailHasBeenSent(false)}>
            An email has been sent to you!
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <Alert.Heading>{error.code}</Alert.Heading>
            <p>{error.message}</p>
          </Alert>
        )}
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="userEmail"
            value={email}
            placeholder="E.g: faruq123@gmail.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Button disabled={!email} type="submit" className="btn btn-primary">
          Send me a reset link
        </Button>
      </Form>
      <hr className="w-50 border" />
      <Link
        to="/signin"
      >
        &larr; back to sign in page
      </Link>
    </div>
  );
};
export default PasswordReset;