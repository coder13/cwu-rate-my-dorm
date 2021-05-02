import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Container, Row, Col, Carousel} from 'react-bootstrap'
import ReviewStyles from '../Styles/ReviewPage.module.css';

class ReviewPage extends Component {

  constructor(props)
  {
    super(props);
  }

  submitReview() 
  {

  }

  componentDidMount()
  {

  }

  render()
  {
    return (

      <div className={ReviewStyles.mainDivSection}> 
        <h1>Review Section Main Section</h1>
        <div onClick={this.submitReview}>ButtonTest</div>
      </div>
    )

  }

}

export default withRouter(ReviewPage);