import React from 'react';
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
        <HomePage />
      </UserProvider>
    )
  }
}

export default App;
