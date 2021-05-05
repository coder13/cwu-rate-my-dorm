import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import UserProvider from './providers/UserProvider';
import SignInPage from'./Pages/SignInPage'
import SignUp from "./Pages/SignUp";
import ProfilePage from "./Pages/ProfilePage";
import AccountPage from './Pages/AccountPage'
import PasswordReset from "./Pages/PasswordReset";
import MapPage from'./Pages/MapPage'
import ExampleHallPage from'./Pages/ExampleHallPage'
import WelcomePage from './Pages/WelcomePage'
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
              <WelcomePage name="name" />
            </Route>
            <Route exact path="/MapPage">
              <MapPage name="name" />
            </Route>
            <Route exact path="/ExampleHallPage">
              <ExampleHallPage />
            </Route>

            <Route exact path="/signin" component={SignInPage} />
            <Route exact path="/signUp" component={SignUp} />
            <Route exact path="/passwordReset" component={PasswordReset} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/account" component={AccountPage} />

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
