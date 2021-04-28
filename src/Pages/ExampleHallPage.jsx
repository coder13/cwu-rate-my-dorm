import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Container, Row, Col, Carousel} from 'react-bootstrap'
import '../Styles/ExampleHallPage.css';
import TopBarComponent from '../Components/TopBarComponent'

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

        <TopBarComponent />

        <Container fluid='true' className='windowDivSection'>
          
          <Row>

            <Col className='middleSection'>

             <Row className='infoAndTopReviewSection'>

              <Col className='titleAndInformationSection'>
                  
                <Row className='titleBlock'>
                  <h1>{this.hallName}</h1>
                </Row>

                  <Row className='imageGalleryBlock'>

                    <Carousel className='imageCarousel'>
                      <Carousel.Item>
                        <img
                          className='carouselImageExample'
                          src="https://www.kpq.com/wp-content/uploads/2018/07/CWU.jpg"
                          alt="First slide"
                        />
                      </Carousel.Item>

                      <Carousel.Item>
                        <img
                          className='carouselImageExample'
                          src="https://katu.com/resources/media/b2bd1ced-1737-478c-92d9-fa0fc374d6a2-large16x9_190419_pio_central_washington_university_cwu.jpg?1555702482536"
                          alt="First slide"
                        />
                      </Carousel.Item>

                      <Carousel.Item>
                        <img
                          className='carouselImageExample'
                          src="https://www.kpq.com/wp-content/uploads/2018/07/CWU.jpg"
                          alt="First slide"
                        />
                      </Carousel.Item>
                    </Carousel>

                  </Row>

                <Row className='infoBlock'>
                  <h1>Info</h1>
                </Row>

              </Col>

              <div className ='spacer'></div>

              <Col className='topReviewSection'>

                <Row className='topReviewBlock'>
                  <h1>Top Reviews Here</h1>
                </Row>

              </Col>

             </Row>

             <Row className='reviewsSection'>
               
               <Row className='reviewsBlock'>
                  <h1>Reviews</h1>
               </Row>

             </Row>

            </Col>

          </Row>

        </Container>

      </div>
    )

  }

}

export default withRouter(ExampleHallPage);