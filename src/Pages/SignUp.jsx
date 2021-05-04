import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Alert, Form, Button } from 'react-bootstrap';
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
      <Form className={Styles.form} onSubmit={createUserWithEmailAndPasswordHandler}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <Alert.Heading>{error.code}</Alert.Heading>
            <p>{error.message}</p>
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
        </Form.Group>
        <Button
          type="submit"
          className="btn btn-primary"
          disabled={!displayName || !email || !password} 
        >
          Sign In
        </Button>
      </Form>
      <br />
      <p className="h5 text-muted">OR</p>
      <br />
      <button className="btn btn-primary" onClick={() => signInWithGoogleHandler()}>
        Sign In with Google
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
