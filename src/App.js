import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import UserProvider from './providers/UserProvider';
import HomePage from'./Pages/HomePage'
// import LoginPage from'./Pages/Login'
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
