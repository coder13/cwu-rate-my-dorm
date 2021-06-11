import firebase from 'firebase/app';
import { useContext, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { Alert, Button, Container, Form, Media } from 'react-bootstrap';
import LoaderComponent from '../Components/LoaderComponent';
import { UserContext } from "../providers/UserProvider";
import { auth, firestore } from '../firebase';

const AccountPage = () => {
  const user = useContext(UserContext);
  const displayNameRef = useRef();
  const emailRef = useRef();
  const [error, setError] = useState(null);
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [displayNameChanged, setDisplayNameChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  //Set Tab Name:
  document.title = "Account Settings Page";

  if (user === undefined) {
    return (
      <LoaderComponent />
      )
    } else if (user === null) {
      return (
        <Link to="/signin">
        Sign In
      </Link>
    )
  }
  
  // if we logged in with google, we can't change the email
  const canChangeEmail = !user.providers.some((provider) => provider.providerId === 'google.com');

  const sendResetEmail = event => {
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
      })
      .catch((e) => {
        setError(e);
      });
  };

  const updateUserDisplayName = async (e) => {
    e.preventDefault();
    const userRef = firestore.doc(`users/${user.uid}`);
  
    try {
      await userRef.set({
        displayName: displayNameRef.current.value,
      }, {
        merge: true
      });

      setDisplayNameChanged(true);
    } catch (error) {
      setError(error);
    }
  }

  const sendEmailVerification = async () => {
    await firebase.auth().currentUser.sendEmailVerification({
      url: `${document.location.origin}/signin?redirect=${document.location.pathname}`
    });
    setEmailSent(true);
  }

  const updateUserEmail = async (e) => {
    e.preventDefault();
    const userRef = firestore.doc(`users/${user.uid}`);
  
    try {
      await userRef.set({
        email: emailRef.current.value,
        emailVerified: false,
        photoURL,
      }, {
        merge: true
      });
      await firebase.auth().currentUser.updateEmail(emailRef.current.value);

      await firebase.auth().currentUser.sendEmailVerification({
        url: `${document.location.origin}/signin?redirect=${document.location.pathname}`
      });
  
      setEmailChanged(true);
    } catch (error) {
      setError(error);
    }
  }

  const { photoURL, displayName, email } = user;
  const avatar = photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png';

  return (
    <Container style={{ margin: '1em' }}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Alert.Heading>{error.code}</Alert.Heading>
          <p>{error.message}</p>
        </Alert>
      )}

      {emailHasBeenSent && (
        <Alert variant="success" dismissible onClose={() => setEmailHasBeenSent(false)}>
          An email has been sent to your address!
        </Alert>
      )}

      {displayNameChanged && (
        <Alert variant="success" dismissible onClose={() => setDisplayNameChanged(false)}>
          Display Name Changed!
        </Alert>
      )}

      {emailChanged && (
        <Alert variant="success" dismissible onClose={() => setEmailChanged(false)}>
          <p>Email Changed!</p>
          <Alert.Heading>Verifiy your email address</Alert.Heading>
          Check your E-Mails (Spam folder included) for a confirmation E-Mail
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <p>Didn't Receive an email? <Alert.Link href='#' onClick={() => sendEmailVerification()}>Resend Email</Alert.Link></p>
          {emailSent && (
            <>
              <hr />
              <p>Email Sent!</p>
            </>
          )}
        </Alert>
      )}
      <h1>Account Settings</h1>
      <Media>
        <img
          width={200}
          height={200}
          className="mr-3"
          src={avatar}
          alt="avatar"
        />
      </Media>
      <hr className="w-100 border" />
      <Form onSubmit={updateUserDisplayName}>
        <Form.Group controlId="displayName"
        >
          <Form.Label>Display Name: </Form.Label>
          <Form.Control
            type="text"
            defaultValue={displayName}
            ref={displayNameRef}
          />
        </Form.Group>
        <Button type="submit">Change Display Name</Button>
      </Form>
      <Form onSubmit={updateUserEmail}>
        <Form.Group disabled={!canChangeEmail} controlId="email" style={{ marginTop: '1em' }}>
          <Form.Label>Email: </Form.Label>
          <Form.Control
            type="email"
            defaultValue={email}
            ref={emailRef}
            />
        </Form.Group>
        <Button type="submit" disabled={!canChangeEmail}>Change Email</Button>
      </Form>
      <br />
      <Button onClick={sendResetEmail}>
        Reset Password
      </Button>
    </Container>
  ) 
};
export default AccountPage;
