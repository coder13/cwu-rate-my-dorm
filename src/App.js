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
import TopBarComp from './Components/TopBarComponent';
import EditReviewPage from './Pages/EditReviewPage';
import PrivateRoute from './Components/PrivateRoute';

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

          <div>
            <TopBarComp/>

            <div className={AppStyle.mainSection}>

              <UserProvider>
                  <Switch>
                    <Route exact path="/" component={WelcomePage} />
                    <Route exact path="/MapPage" component={MapPage} />
                    <Route path="/halls/:hall" component={ExampleHallPage} />
                    <PrivateRoute exact path="/ReviewPage"><ReviewPage /></PrivateRoute>
                    <Route exact path="/signin" component={SignInPage} />
                    <Route exact path="/signUp" component={SignUp} />
                    <Route exact path="/passwordReset" component={PasswordReset} />
                    <PrivateRoute exact path="/profile"><ProfilePage/></PrivateRoute>
                    <PrivateRoute exact path="/account"><AccountPage/></PrivateRoute>
                    <PrivateRoute exact path="/EditReviewPage"><EditReviewPage /></PrivateRoute>
                    <Route path="*">
                      <p>404: Page not Found</p>
                    </Route>
                  </Switch>
              </UserProvider>

            </div>

          </div>
        </Router>
      </UserProvider>
    )
  }
}

export default App;
