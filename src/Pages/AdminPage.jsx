import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AdminPageStyles from '../Styles/AdminPageStyles.module.css'
import {Container,
        Row,
        Col,
        Carousel,
        Card,
        Button,
        Form
      } from 'react-bootstrap'

class Admin extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  //===render===
  //Desc: Renders the html.
  render() {
    return(
      
      <Container fluid>
      </Container>
    );
  }
}

export default withRouter(Admin);