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
import SignUp from "./Pages/SignUp";
import ProfilePage from "./Pages/ProfilePage";
import PasswordReset from "./Pages/PasswordReset";
import HomePage from'./Pages/HomePage'
<<<<<<< HEAD
import MapPage from'./Pages/MapPage'
import ExampleHallPage from'./Pages/ExampleHallPage'
import SignInPage from'./Pages/SignInPage'
=======
>>>>>>> ad16459c2b1ce2bfbf8c95602aebe86f857535af
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
              <MapPage name="name" />
            </Route>
<<<<<<< HEAD
            <Route exact path="/ExampleHallPage">
              <ExampleHallPage />
            </Route>

            <Route exact path="/signin" component={SignInPage} />
            <Route exact path="/signUp" component={SignUp} />
            <Route exact path="/passwordReset" component={PasswordReset} />

=======
            <SignUp path="signUp" />
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
>>>>>>> ad16459c2b1ce2bfbf8c95602aebe86f857535af
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
