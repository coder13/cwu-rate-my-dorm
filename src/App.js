import UserProvider, { useUser } from './providers/UserProvider';
import { auth } from './firebase';
import './App.css';
import HomePage from'./Pages/HomePage'
import React from 'react';

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
        <HomePage />
    </UserProvider>
    )
  }
}

export default App;
