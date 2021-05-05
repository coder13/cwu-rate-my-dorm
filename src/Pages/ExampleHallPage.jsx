import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Container, Row, Col, Carousel} from 'react-bootstrap'
import ExampleStyles from '../Styles/ExampleHallPage.module.css';

class ExampleHallPage extends Component {

  constructor(props)
  {
    super(props);
    this.state = this.props.location.state;

    //Get hall name:
    this.hallName = this.props.location.state.hallName;
  }

  componentDidMount()
  {

  }

  render()
  {

    return(

      <div>

        <Container fluid='true' className={ExampleStyles.windowDivSection}>
          
          <Row>

            <Col className={ExampleStyles.middleSection}>

             <Row className={ExampleStyles.infoAndTopReviewSection}>

              <Col className={ExampleStyles.titleAndInformationSection}>
                  
                <Row className={ExampleStyles.titleBlock}>
                  <h1>{this.hallName}</h1>
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
                  <h1>Info</h1>
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

}

export default withRouter(ExampleHallPage);