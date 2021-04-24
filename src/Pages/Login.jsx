import { Component } from 'react';
import { signInWithGoogle } from '../firebase';
import Styles from '../Styles/Login.module.css';

class Login extends Component {

    state = {
      email: '',
      password: '',
      error: null,
    }

    signInWithEmailAndPasswordHandler(event, email, password) {
      event.preventDefault();
    }

    render() {
      const { email, password } = this.state;

      return (
        <div className={Styles.loginContainer}>
          <form style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
          }}>
            <label htmlFor="emailInput">Email: </label>
            <input
              id="emailInput"
              type="text"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
            <label htmlFor="passwordInput">Password: </label>
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <button type="submit" onClick={this.signInWithEmailAndPasswordHandler}>Login</button>
          </form>
          <hr />
          <button onClick={signInWithGoogle}>Login With Google</button>
        </div>
      );
    }
}

export default Login;
