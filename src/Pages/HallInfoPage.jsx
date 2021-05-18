import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {getDormByName} from '../firestore'
import {Container, Row, Carousel, Card, Button} from 'react-bootstrap'
import LoaderComponent from '../Components/LoaderComponent';
import InfoStyles from '../Styles/HallInfoPage.module.css';

class HallInfoPage extends Component {

  //===navigateToPage===
  //Desc: Handles navigation to next page.
  navigateToPage(toPass) {
    this.props.history.push({pathname: "/", state:{hallName: toPass}});
  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount(){
  }

  //===render===
  //Desc: Renders the html.
  render()
  {
      return (
        <Container fluid className={InfoStyles.mainContainer}>

          <Container className={InfoStyles.middleSection}>

            <Row className={InfoStyles.infoAndImageSection}>
              <div className={InfoStyles.ImageAndAmenititesSection}>
                <div className={InfoStyles.topBlock}>
                </div>
                <div className={InfoStyles.imageBlock}>
                  {"hall image"}
                </div>
                <div className={InfoStyles.roomTypeBlock}>
                  {"room types"}
                </div>
              </div>
              <div className={InfoStyles.titleAndDescriptionSection}>
                <div className={InfoStyles.titleBlock}>
                  {"Hall Name"}
                </div>
                <div className={InfoStyles.descriptionBlock}>
                  {"hall description"}
                </div>
                <div className={InfoStyles.amenitiesBlock}>
                  {"amenities"}
                </div>
              </div>
              
            </Row>
          </Container>
        </Container>
      )
    }
    
  }



export default withRouter(HallInfoPage);