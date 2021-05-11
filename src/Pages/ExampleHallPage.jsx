import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getReviewsByDormName, getDormDocs } from '../firestore'
import {Container, Row, Col, Carousel} from 'react-bootstrap'
import LoaderComponent from '../Components/LoaderComponent';
import ExampleStyles from '../Styles/ExampleHallPage.module.css';

class ExampleHallPage extends Component {

  constructor(props)
  {
    super(props);
    this.state = 
    {
      hallName: this.props.location.state.hallName,
      hallReviews: null,
      hallDocs: null,
      loaded: false
    }

  }

  componentDidMount()
  {
    //Loading Hall reviews from database.
    getReviewsByDormName(this.state.hallName)
    .then((result)=>
      { 
        this.setState({hallReviews: result});
        this.setState({loaded: true});
      }
    );

    //Loading Hall info from database.
    getDormDocs()
    .then((result)=>
      { 
        this.setState({hallDocs: result});
      }
    );

  }

  render()
  {
    
    if(this.state.loaded)
    {
      return (
        <div>

          <Container fluid='true' className={ExampleStyles.windowDivSection}>

            <Row>

              <Col className={ExampleStyles.middleSection}>

                <Row className={ExampleStyles.infoAndTopReviewSection}>

                  <Col className={ExampleStyles.titleAndInformationSection}>

                    <Row className={ExampleStyles.titleBlock}>
                      <h1>{this.state.hallName}</h1>
                    </Row>

                    <Row className={ExampleStyles.imageGalleryBlock}>

                      <Carousel className={ExampleStyles.imageCarousel}>
                        <Carousel.Item>
                          <img
                            className={ExampleStyles.carouselImageExample}
                            src="https://www.kpq.com/wp-content/uploads/2018/07/CWU.jpg"
                            alt="First slide"
                          />
                        </Carousel.Item>

                        <Carousel.Item>
                          <img
                            className={ExampleStyles.carouselImageExample}
                            src="https://katu.com/resources/media/b2bd1ced-1737-478c-92d9-fa0fc374d6a2-large16x9_190419_pio_central_washington_university_cwu.jpg?1555702482536"
                            alt="First slide"
                          />
                        </Carousel.Item>

                        <Carousel.Item>
                          <img
                            className={ExampleStyles.carouselImageExample}
                            src="https://www.kpq.com/wp-content/uploads/2018/07/CWU.jpg"
                            alt="First slide"
                          />
                        </Carousel.Item>
                      </Carousel>

                    </Row>

                    <Row className={ExampleStyles.infoBlock}>
                      <h1>{this.state.hallReviews[0].review}</h1>
                    </Row>

                  </Col>

                  <Col className={ExampleStyles.topReviewSection}>

                    <Row className={ExampleStyles.topReviewBlock}>
                      <h1>Top Reviews Here</h1>
                    </Row>

                  </Col>

                </Row>

                <Row className={ExampleStyles.reviewsSection}>

                  <div className={ExampleStyles.reviewsBlock}>
                    <h1>Reviews</h1>
                  </div>

                </Row>

              </Col>

            </Row>

          </Container>

        </div>
      )
    }
    else //List is still loading. 
    {
      return(<LoaderComponent />);
    }
    
  }

}

export default withRouter(ExampleHallPage);