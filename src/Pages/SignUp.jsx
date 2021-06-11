import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Alert, Form, Button } from 'react-bootstrap';
import { auth, generateUserDocument, signInWithGoogle } from '../firebase';
import PasswordStrengthBar from 'react-password-strength-bar';
import Styles from '../Styles/SignInPage.module.css';

const SignUp = () => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [passwordLongEnough, setPasswordLongEnough] = useState(false);
  const [emailVerificationLinkHasBeenSent, setEmailVerificationLinkHasBeenSent] = useState(null);
  const [emailVerificationLinkHasBeenResent, setEmailVerificationLinkHasBeenResent] = useState(null);
  const [user, setUser] = useState({});

  //Set Tab Name:
  document.title = "CWU Rate My Dorm: Sign-Up";

  const redirect = location.state && location.state.from ? location.state.from : '/';

  const createUserWithEmailAndPasswordHandler = async (event) => {
    setError(null);
    event.preventDefault();
    try {
      const newUser = await auth.createUserWithEmailAndPassword(email, password);

      await generateUserDocument(newUser.user, { displayName });

      await newUser.user.sendEmailVerification({
        url: `${document.location.origin}/signin?redirect=${redirect}`,
      });

      auth.signOut();

      setUser(newUser.user);
      setEmailVerificationLinkHasBeenSent(true);
      setEmail('');
      setDisplayName('');
    }
    catch (error) {
      setError(error);
    }
    
    setPassword('');
  };

  const resendEmail = async () => {
    try {
      await user.sendEmailVerification({
        url: `${document.location.origin}/signin?redirect=${redirect}`,
      });
      setEmailVerificationLinkHasBeenResent(true);
    } catch (error) {
      setError(error);
    }
  }

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
      <Form className={Styles.form} onSubmit={createUserWithEmailAndPasswordHandler}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <Alert.Heading>{error.code}</Alert.Heading>
            <p>{error.message}</p>
          </Alert>
        )}
        {emailVerificationLinkHasBeenSent && (
          <Alert variant="success" dismissible onClose={() => setEmailVerificationLinkHasBeenSent(false)}>
            <Alert.Heading>Verifiy your email address</Alert.Heading>
            <p>Check your E-Mails (Spam folder included) for a confirmation E-Mail</p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <p>Didn't Receive an email? <Alert.Link href='#' onClick={() => resendEmail()}>Resend Email</Alert.Link></p>
            { emailVerificationLinkHasBeenResent && (
              <>
                <hr/>
                <p>Email Sent!</p>
              </>
            )}
          </Alert>
        )}
        <Form.Group controlId="displayName">
          <Form.Label>Display Name: </Form.Label>
          <Form.Control
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="E.g: Faruq"
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email: </Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E.g: faruq123@gmail.com"
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <PasswordStrengthBar
            password={password}
            onChangeScore={(score) => setPasswordLongEnough(score > 0)}
          />
        </Form.Group>
        <Button
          type="submit"
          className="btn btn-primary"
          disabled={!displayName || !email || !password || !passwordLongEnough} 
        >
          Sign Up
        </Button>
      </Form>
      <br />
      <p className="h5 text-muted">OR</p>
      <br />
      <button className="btn btn-primary" onClick={() => signInWithGoogleHandler()}>
        Sign Up with Google
      </button>
      <hr className="w-50 border" />
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
