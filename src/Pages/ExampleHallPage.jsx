import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {getReviewsByDormName, getDormByName, getRatings} from '../firestore'
import {Container, Row, Carousel, Card, Button} from 'react-bootstrap'
import LoaderComponent from '../Components/LoaderComponent';
import ExampleStyles from '../Styles/ExampleHallPage.module.css';

class ExampleHallPage extends Component {

  constructor(props)
  {
    super(props);

    this.state = 
    {
      hallName: this.props.match.params.hall,
      hallReviews: null,
      hallDocs: null,
      hallImages: null,
      hallDescription: null,
      overallRatingTotal: null,
      locationRatingTotal: null,
      roomSizeRatingTotal: null, 
      furnitureRatingTotal: null,
      commonAreasRatingTotal: null,
      cleanlinessRatingTotal: null,
      bathroomRatingTotal: null,
      currentUserImage: null,
      displayCurUserImage: false,
      loaded: false
    }

    //bind the class functions with this.
    this.generateReviews = this.generateReviews.bind(this);
    this.generateImages = this.generateImages.bind(this);
    this.userImagePopup = this.userImagePopup.bind(this);
    this.generateUserImages = this.generateUserImages.bind(this);
    this.topInfoSection = this.topInfoSection.bind(this);
  }

  //===navigateToPage===
  //Desc: Handles navigation to next page.
  navigateToPage(toPass) {
    this.props.history.push({pathname: "/HallInfoPage", state:{hallName: toPass}});
  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount()
  {

    //Set Tab Name:
    document.title = this.state.hallName;

    //Loading Hall reviews and information from database.
    getReviewsByDormName(this.state.hallName)
    .then((result)=>{
      this.setState({hallReviews: result});
    }
    ).then(()=>{
      getDormByName(this.state.hallName)
      .then((dormNameResult) => {
        this.setState({hallDocs: dormNameResult});
        this.setState({hallImages: dormNameResult.get("images")});
        this.setState({hallDescription: dormNameResult.get("description")});
        this.setState({hallRating: dormNameResult.get("rating")});
        this.setState({loaded: true});
      });
    }).then(()=>{
      getRatings(this.state.hallName)
      .then((dormResult) => {
        this.setState({
          overallRatingTotal: dormResult[0],
          locationRatingTotal: dormResult[1],
          roomSizeRatingTotal: dormResult[2],
          furnitureRatingTotal: dormResult[3],
          commonAreasRatingTotal: dormResult[4],
          cleanlinessRatingTotal: dormResult[5],
          bathroomRatingTotal: dormResult[6],
          loaded: true
        });
      });
    });
  }

  //===userImagePopup===
  //Desc: Displays a pop up image for the user.
  userImagePopup() 
  {
    return (
      <div className={ExampleStyles.userImagePopUp} onClick={()=>{this.setState({displayCurUserImage: false})}}>
        <img className={ExampleStyles.userImage} src={this.state.currentUserImage} alt=""/>
        <Button 
          className={ExampleStyles.topcorner} 
          variant="danger" 
          onClick={()=>{this.setState({displayCurUserImage: false})}}><b>X</b></Button>
      </div>
    );
  }

  //===generateUserImages===
  generateUserImages(imageArr)
  {
    const toReturn = imageArr.map((curImage) =>
      <img className={ExampleStyles.reviewTemplateImageBorder}
        src={curImage}
        alt=""
        key ={curImage}
        onClick={() => { this.setState({ displayCurUserImage: true }); this.setState({ currentUserImage: curImage }); }}
      />
    );

    return(toReturn);
  }

  //===generateReviews===
  //Desc: Genereates reviews from database values.
  generateReviews(props) 
  {
    const reviewsToAdd = props.reviews;

    console.log(reviewsToAdd);

    if(reviewsToAdd <= 0)
    {
      return(
        <div className={ExampleStyles.reviewsBlock}>
          <div className={ExampleStyles.noReviews}>No Reviews Yet...</div>
        </div>
      );
    }

    const toReturn = reviewsToAdd.map((curReview) =>
      curReview.get("images").length > 0 ? 
        <div key={curReview.id} className={ExampleStyles.reviewTemplate}>
          <div className={ExampleStyles.reviewTemplateTitle}>
            <div className={ExampleStyles.reviewAuthor}>Author</div>
            {": " + curReview.get("author")}
          </div>

          <div className={ExampleStyles.reviewTemplateRating}>
            <div className={ExampleStyles.reviewRating}>Overall Rating</div>
            {": " +curReview.get("overallRating")}
          </div>

          <div className={ExampleStyles.reviewTemplateBody}>

            <div className={ExampleStyles.reviewTemplateDesc}>
              {curReview.get("review")}
            </div>

            <div className={ExampleStyles.reviewTemplateImages}>
              {this.generateUserImages(curReview.get("images"))}
            </div>

          </div>

        </div>
       : 
        <div key={curReview.id} className={ExampleStyles.reviewTemplate}>
          
          <div className={ExampleStyles.reviewTemplateTitle}>
            <div className={ExampleStyles.reviewAuthor}>Author</div>
            {": " + curReview.get("author")}
          </div>

          <div className={ExampleStyles.reviewTemplateRating}>
            <div className={ExampleStyles.reviewRating}>Overall Rating</div>
            {": " +curReview.get("overallRating")}
          </div>

          <div className={ExampleStyles.reviewTemplateBody}>

            <div className={ExampleStyles.reviewTemplateDesc}>
              {curReview.get("review")}
            </div>

          </div>

        </div>
    );

    return(
      <div className={ExampleStyles.reviewsBlock}>
        {toReturn}
      </div>
    );
  }

  //===topInfoSection===
  //Desc: Renders the top info section:
  topInfoSection()
  {
    return(
      <div className={ExampleStyles.titleAndInformationSection}>

        <div className={ExampleStyles.titleBlock}>
          {this.state.hallName}
        </div>

        <div className={ExampleStyles.imageGalleryBlock}>

          <div className={ExampleStyles.imageCarouselSection}>
            <this.generateImages images={this.state.hallImages} />
          </div>

          <div className={ExampleStyles.infoBlock}>
            <Card bg={'light'} className={ExampleStyles.infoCard}>
              <Card.Header><b>Hall Information:</b></Card.Header>
              <Card.Body>

                <div className={ExampleStyles.infoCardOverall}>
                  Average Hall Rating: {this.state.overallRatingTotal}
                </div>

                <div className={ExampleStyles.infoCardSub}>
                  <p>
                    Location Rating: {this.state.locationRatingTotal}<br />
                    Room Size Rating: {this.state.roomSizeRatingTotal}<br />
                    Furiture Rating: {this.state.furnitureRatingTotal}<br />
                    Common Areas Rating: {this.state.commonAreasRatingTotal}<br />
                    Cleanliness Rating: {this.state.cleanlinessRatingTotal}<br />
                    Bathroom Rating: {this.state.bathroomRatingTotal}<br />
                  </p>
                </div>

                <div>
                  <h5>Description:</h5>
                  {this.state.hallDescription}
                  <br />
                  <br />
                  <Button variant="primary" onClick={() => { this.navigateToPage(this.state.hallName) }}>More Info</Button>
                </div>

              </Card.Body>
            </Card>
          </div>

        </div>

      </div>
    );
  }

  //===generateImages===
  //Desc: Genereates images from database values.
  generateImages(props) 
  {
    const imagesToAdd = props.images;
    const toReturn = imagesToAdd.map((curImage) => 
      <Carousel.Item key={curImage}>
        <img
          className={ExampleStyles.carouselImageExample}
          src={curImage}
          alt=""
        />
      </Carousel.Item>
    );

    return(
      <Carousel className={ExampleStyles.imageCarousel}>
        {toReturn}
      </Carousel>
    );
  }

  //===render===
  //Desc: Renders the html.
  render()
  {
    
    if(this.state.loaded)
    {
      return (
        <div>

          {this.state.displayCurUserImage ? <this.userImagePopup/>: null}

          <Container fluid className={ExampleStyles.mainContainer}>
            <Container className={ExampleStyles.middleSection}>

              <Row className={ExampleStyles.infoAndTopReviewSection}>
                <this.topInfoSection/>
              </Row>

              <Row className={ExampleStyles.reviewsSection}>
                <Row className={ExampleStyles.reviewsTitle}>
                  <h2>User Reviews({this.state.hallReviews.length}):</h2>
                </Row>
                <this.generateReviews reviews={this.state.hallReviews} />
              </Row>

              <Row className={ExampleStyles.footer}></Row>

            </Container>
          </Container>

        </div>
      )
    }
    else return(<LoaderComponent />);

  }

}

export default withRouter(ExampleHallPage);