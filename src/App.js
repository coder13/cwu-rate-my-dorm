import UserProvider, { useUser } from './providers/UserProvider';
import { auth } from './firebase';
import './App.css';
import HomePage from'./Pages/HomePage'
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

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
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="*">
            <p>404: Page not Found</p>
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
