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
        Button,
        Form
      } from 'react-bootstrap'
import SearchImage from '../Assets/SearchCardTop.png'
import WriteImage from '../Assets/WriteCardTop.png'
import {newSuggestion} from '../firestore'


class WelcomePage extends Component {

  constructor(props){
    super(props);
    this.state = {
      suggestionDisplay: false,
      suggestionText: ""
    }

    this.suggestionPopUpWindow = this.suggestionPopUpWindow.bind(this);
    this.submitSuggestion = this.submitSuggestion.bind(this);
  }

  //===navigateToPage===
  //Desc: Handles navigation to next page.
  navigateToPage(Page) {
    this.props.history.push({pathname: Page});
  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount() {
  }

  submitSuggestion() {
  
    newSuggestion(this.state.suggestionText);
    this.setState({suggestionDisplay: false});
    alert("Your suggestion was submited!");

  }

  suggestionPopUpWindow() {
    return(
    <div className={WelcomePageStyles.suggestionPopUpWindow}>
          <div className={WelcomePageStyles.suggestionBox}>
            <div className={WelcomePageStyles.suggestionBoxTitle}>
              Leave a Suggestion:
            </div>
            <div className={WelcomePageStyles.suggestionBoxBody}>
              <Form className={WelcomePageStyles.suggestionForm}>
                <Form.Group>

                  <Form.Control
                    as="textarea"
                    rows={7}
                    className={WelcomePageStyles.suggestionTextBox}
                    onChange={e => this.setState({ suggestionText: e.target.value })}
                  />
                  <Button 
                    className = {WelcomePageStyles.suggestionBoxButton}
                    onClick={this.submitSuggestion}
                  >
                    Submit
                  </Button>

                </Form.Group>
              </Form>
            </div>
          </div>
        </div>
    );
  }

  //===render===
  //Desc: Renders the html.
  render() {
    return(
      
      <Container fluid className={WelcomePageStyles.mainContaier}>

        {this.state.suggestionDisplay ? <this.suggestionPopUpWindow/>: null}

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
                      onClick={()=>{this.navigateToPage("ReviewPage")}}
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
              
              <Carousel className={WelcomePageStyles.carouselSize}>
                <Carousel.Item>
                  <img
                    className={WelcomePageStyles.imageSize}
                    src="https://www.kpq.com/wp-content/uploads/2018/07/CWU.jpg"
                    alt="First slide"
                  />
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className={WelcomePageStyles.imageSize}
                    src="https://katu.com/resources/media/b2bd1ced-1737-478c-92d9-fa0fc374d6a2-large16x9_190419_pio_central_washington_university_cwu.jpg?1555702482536"
                    alt="First slide"
                  />
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className={WelcomePageStyles.imageSize}
                    src="https://www.kpq.com/wp-content/uploads/2018/07/CWU.jpg"
                    alt="First slide"
                  />
                </Carousel.Item>
              </Carousel>

            </Row>

            <Row className={WelcomePageStyles.suggestionRow}>
              <div className={WelcomePageStyles.suggestionCard}>
                <div className={WelcomePageStyles.suggestionText}>Have a suggestion for our site? Please let us know!</div>
                <Button
                      variant="primary"
                      onClick={() => { this.setState({suggestionDisplay: true})}}
                    >Leave a suggestion</Button>
              </div>
            </Row>

          </Container>

        </Row>

      </Container>
    );
  }
}

export default withRouter(WelcomePage);