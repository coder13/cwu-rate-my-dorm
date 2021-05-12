import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getReviewsByDormName, getDormDocs } from '../firestore'
import {Container, Row, Col, Carousel, Card} from 'react-bootstrap'
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

    this.generateReviews = this.generateReviews.bind(this);
  }

  componentDidMount()
  {
    //Loading Hall reviews and information from database.
    getReviewsByDormName(this.state.hallName)
    .then((result)=>
      { 
        this.setState({hallReviews: result});
      }
    ).then(()=>
    {
      getDormDocs()
      .then((result)=>
        { 
          this.setState({hallDocs: result});
          console.log(result);
          this.setState({loaded: true});
        }
      );
    });
  }

  generateReviews(props) 
  {
    const reviewsToAdd = props.reviews;

    const toReturn = reviewsToAdd.map((curReview) =>

      <div className={ExampleStyles.reviewTemplate}>
        <div className={ExampleStyles.reviewTemplateTitle}>

          <div className={ExampleStyles.reviewTemplateTitleCol}>
            Author: {curReview.get("author")}
          </div>
          <div className={ExampleStyles.reviewTemplateTitleCol}>
            Room Type: {curReview.get("roomType")}
          </div>
          <div className={ExampleStyles.reviewTemplateTitleCol}>
            Floor: {curReview.get("floor")}
          </div>
          <div className={ExampleStyles.reviewTemplateTitleCol}>
            Overall Rating: {curReview.get("overallRating")}
          </div>

        </div>

        <div className={ExampleStyles.reviewTemplateBody}>
          
          <div className={ExampleStyles.reviewTemplateLeft}>
            {curReview.get("review")}
          </div>
          
          <div className={ExampleStyles.reviewTemplateRight}>
            <p><b>First Quarter: </b>{curReview.get("firstQuarter")}</p>
            <p><b>Last Quarter: </b>{curReview.get("lastQuarter")}</p>
            <p><b>Cleanliness Rating: </b>{curReview.get("cleanlinessRating")}</p>
            <p><b>Furniture Rating: </b>{curReview.get("furnitureRating")}</p>
            <p><b>Location Rating: </b>{curReview.get("locationRating")}</p>
            <p><b>Room Size Rating: </b>{curReview.get("roomSizeRating")}</p>
          </div>
         
        </div>

      </div>
    );

    console.log(toReturn);

    return(
      <div className={ExampleStyles.reviewsBlock}>
        {toReturn}
      </div>
    );
  }

  render()
  {
    
    if(this.state.loaded)
    {
      return (
        <Container fluid className={ExampleStyles.mainContainer}>

          <Container className={ExampleStyles.middleSection}>

            <Row className={ExampleStyles.infoAndTopReviewSection}>

              <div className={ExampleStyles.titleAndInformationSection}>

                <div className={ExampleStyles.titleBlock}>
                  {this.state.hallName}
                </div>

                <div className={ExampleStyles.imageGalleryBlock}>
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
                </div>

                <div className={ExampleStyles.infoBlock}>
                  <Card
                    bg={'light'}
                    className={ExampleStyles.infoCard}
                  >
                    <Card.Header><b>Hall Information:</b></Card.Header>
                    <Card.Body>

                    <Card.Text>
                      Some quick Hall info.<br/>
                      Button to hall info page.
                    </Card.Text>
                    </Card.Body>
                  </Card>
                </div>

              </div>

              <div className={ExampleStyles.topReviewSection}>
                <Card
                    bg={'light'}
                    className={ExampleStyles.topReviewCard}
                >
                  <Card.Header><b>Top Reviews:</b></Card.Header>
                  <Card.Body>
                    Determine how to choose top reviews.
                  </Card.Body>
                </Card>
              </div>

            </Row>

            <Row className={ExampleStyles.reviewsTitle}>
              <h1>Reviews:</h1>
            </Row>

            <Row className={ExampleStyles.reviewsSection}>
              <this.generateReviews reviews={this.state.hallReviews} />
            </Row>

            <Row className={ExampleStyles.footer}></Row>

          </Container>


        </Container>
      )
    }
    else //List is still loading. 
    {
      return(<LoaderComponent />);
    }
    
  }

}

export default withRouter(ExampleHallPage);