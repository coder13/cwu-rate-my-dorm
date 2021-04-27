import { Component } from 'react';
import { auth, signInWithGoogle } from '../firebase';
import Styles from '../Styles/SignInPage.module.css';

class SignInPage extends Component {

    state = {
      email: '',
      password: '',
      error: null,
    }

    componentDidMount() {
      this.signInWithEmailAndPasswordHandler = this.signInWithEmailAndPasswordHandler.bind(this);
      // this.signInWithGoogleHandler = this.signInWithGoogleHandler.bind(this);
    }

    signInWithEmailAndPasswordHandler(event) {
      event.preventDefault();
      const { email, password } = this.state;
      auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          console.log(result);
        })
        .catch(error => {
          this.setState({
            error,
            password: '',
          });
        console.error('Error signing in with password and email', error);
      });
    }

    signInWithGoogleHandler(event) {
      const { history, location } = this.props;
      signInWithGoogle()
        .then((result) => {
          history.push(location.state.from);
        })
    }

    render() {
      console.log(44, this.props);
      const { error, email, password } = this.state;

      return (
        <div className={Styles.loginContainer}>
          {error && (<p className={Styles.error}>{error.code}<br />{error.message}</p>)}
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
          <p>OR</p>
          <button onClick={() => this.signInWithGoogleHandler()}>Login With Google</button>
        </div>
      );
    }
}

export default SignInPage;
