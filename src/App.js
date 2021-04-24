import './App.css';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import ExampleHallPage from'./Pages/ExampleHallPage'
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

      <Router>

        <Route exact path="/" component={HomePage} />
        <Route path="/ExampleHallPage" component={ExampleHallPage} />
        
      </Router>

    )
  }

}

export default App;
