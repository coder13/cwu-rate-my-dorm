/* Dev: Eli McCoy
 * Date: 4/22/21
 * Desc: Welcome page component.
 */

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import WelcomePageStyles from '../Styles/WelcomePage.module.css'
import {Container,
        Row,
        Col,
        Carousel,
        Card,
        Button
      } from 'react-bootstrap'
import SearchImage from '../Assets/SearchCardTop.png'
import WriteImage from '../Assets/WriteCardTop.png'
import Wellington from '../Assets/Wellington.jpg'


class WelcomePage extends Component {

  //===navigateToPage===
  //Desc: Handles navigation to next page.
  navigateToPage(Page) {
    this.props.history.push({pathname: Page});
  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount() {
  }

  //===render===
  //Desc: Renders the html.
  render() {
    return(
      
      <Container fluid className={WelcomePageStyles.mainContaier}>
      
        <Row className={WelcomePageStyles.mainRow}>
          
          <Container fluid className={WelcomePageStyles.container}>

            <Row className={WelcomePageStyles.titleRow}>
              CWU Rate My Dorm
            </Row>

            <Row className={WelcomePageStyles.buttonRow}>

              <Col className={WelcomePageStyles.buttonBoxLeft}>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={WriteImage} />
                  <Card.Body>
                    <Card.Title>Write a Review</Card.Title>
                    <Card.Text>
                      Write a review and share your opinion with others.
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => { this.navigateToPage("ReviewPage") }}
                    >
                      Write a Review
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col className={WelcomePageStyles.buttonBoxRight}>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={SearchImage} />
                  <Card.Body>
                    <Card.Title>Read Reviews</Card.Title>
                    <Card.Text>
                      Read reviews, see ratings, and get information about the dorms.
                    </Card.Text>
                    <Button 
                      variant="primary"
                      onClick={()=>{this.navigateToPage("MapPage")}}
                    >
                      Read Reviews
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

            </Row>

            <Row className={WelcomePageStyles.bottomRow}>
              
              <div className={WelcomePageStyles.wellingtonColumn}>
                <img src={Wellington} className={WelcomePageStyles.wellingtonSize} alt=""/>
              </div> 

              <div className={WelcomePageStyles.speechBubbleColumn}>
                <div>
                  Text here.
                </div>
              </div>

            </Row>

          </Container>

        </Row>

      </Container>
    );
  }
}

export default withRouter(WelcomePage);