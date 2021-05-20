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
import AppStyle from './App.module.css';
import ReviewPage from './Pages/ReviewPage';
import TopBarComp from './Components/TopBarComponent'
import withEmailVerification from './hooks/withEmailVerification';

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      test: true
    };
  }

  render() {
    return (
      <Router>
        <UserProvider>

          <div>
            <TopBarComp/>

            <div className={AppStyle.mainSection}>

                  <Switch>
                    <Route exact path="/" component={WelcomePage} />
                    <Route exact path="/MapPage" component={MapPage} />
                    <Route exact path="/ExampleHallPage" component={ExampleHallPage} />
                    <Route exact path="/ReviewPage" component={withEmailVerification(ReviewPage)} />
                    <Route exact path="/signin" component={SignInPage} />
                    <Route exact path="/signUp" component={SignUp} />
                    <Route exact path="/passwordReset" component={PasswordReset} />
                    <Route exact path="/profile" component={ProfilePage} />
                    <Route exact path="/account" component={AccountPage} />
                    <Route path="*">
                      <p>404: Page not Found</p>
                    </Route>
                  </Switch>

            </div>

          </div>
        </UserProvider>
      </Router>
    )
  }
}

export default App;
