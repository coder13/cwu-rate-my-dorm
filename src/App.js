import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ProfilePage from "./Pages/ProfilePage";
import PasswordReset from "./Pages/PasswordReset";
import UserProvider from './providers/UserProvider';
import HomePage from'./Pages/HomePage'
import './App.css';

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      test: true
    };
  }

  render() {
    return (
      <UserProvider>
        <Router>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <SignUp path="signUp" />
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
            <Route path="*">
              <p>404: Page not Found</p>
            </Route>
          </Switch>
        </Router>
      </UserProvider>
    )
  }
}

export default App;
