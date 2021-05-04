import { useState } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { auth, signInWithGoogle } from '../firebase';
import Styles from '../Styles/SignInPage.module.css';

const SignInPage = () => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const redirect = location.state && location.state.from ? location.state.from : '/';

  const signInWithEmailAndPasswordHandler = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        history.push(redirect);
      })
      .catch(error => {
        setError(error);
        setPassword('');
        console.error('Error signing in with password and email', error);
      });
  }

  const signInWithGoogleHandler = (event) => {
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
    <h1 className="">Sign In</h1>
    {error && (<p className={Styles.error}>{error.code}<br />{error.message}</p>)}
      <Form className={Styles.form} onSubmit={signInWithEmailAndPasswordHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email: </Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          type="submit"
          className="btn btn-primary"
          disabled={!email || !password} 
        >
          Sign In
        </Button>
      </Form>
      <br />
      <p className="h5 text-muted">OR</p>
      <br />
      <button className="btn btn-primary" onClick={() => signInWithGoogleHandler()}>Sign In With Google</button>
      <hr className="w-50 border" />
      <p>
        Don't have an account?{' '}
        <Link to="/signUp">
          Sign up here
        </Link>{' '}
        <br />{' '}
        <Link to="/passwordReset">
          Forgot Password?
        </Link>
      </p>
    </div>
  );
}

export default SignInPage;
