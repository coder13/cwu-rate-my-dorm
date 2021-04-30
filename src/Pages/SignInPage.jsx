import { useState } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
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
      <form className={Styles.form} onSubmit={signInWithEmailAndPasswordHandler}>
        <label htmlFor="emailInput">Email: </label>
        <input
          id="emailInput"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="passwordInput">Password: </label>
        <input
          id="passwordInput"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
      <p>OR</p>
      <button onClick={() => signInWithGoogleHandler()}>Sign In With Google</button>
      <hr/>
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
