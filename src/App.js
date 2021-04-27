import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import UserProvider from './providers/UserProvider';
import HomePage from'./Pages/HomePage'
import MapPage from'./Pages/MapPage'
import ExampleHallPage from'./Pages/ExampleHallPage'
import SignInPage from'./Pages/SignInPage'
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
            <Route exact path="/ExampleHallPage">
              <ExampleHallPage />
            </Route>
            <Route exact path="/signin" component={SignInPage} />
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
