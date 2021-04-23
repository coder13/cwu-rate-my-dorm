import './App.css';
import ExPage from'./Pages/ExampleHallPage'
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
      <HomePage />
    )
  }

}

export default App;
