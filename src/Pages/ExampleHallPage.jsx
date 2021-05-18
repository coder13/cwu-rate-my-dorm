import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {getReviewsByDormName, getDormByName} from '../firestore'
import {Container, Row, Carousel, Card, Button} from 'react-bootstrap'
import LoaderComponent from '../Components/LoaderComponent';
import XButton from '../Assets/xButton.png'
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
      hallRating: null,
      currentUserImage: null,
      displayCurUserImage: false,
      loaded: false
    }

    //bind the class functions with this.
    this.generateReviews = this.generateReviews.bind(this);
    this.generateImages = this.generateImages.bind(this);
    this.userImagePopup = this.userImagePopup.bind(this);
    this.generateUserImages = this.generateUserImages.bind(this);
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

    });
  }

  //===userImagePopup===
  //Desc: Displays a pop up image for the user.
  userImagePopup() 
  {
    return (
      <div className={ExampleStyles.userImagePopUp} onClick={()=>{this.setState({displayCurUserImage: false})}}>
        <img className={ExampleStyles.userImage} src={this.state.currentUserImage} alt=""/>
        <img className={ExampleStyles.topcorner} src={XButton} onClick={()=>{this.setState({displayCurUserImage: false})}} alt=""/>
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

                <div className={ExampleStyles.titleAndInformationSection}>

                  <div className={ExampleStyles.titleBlock}>
                    {this.state.hallName}
                  </div>

                  <div className={ExampleStyles.imageGalleryBlock}>

                    <div className={ExampleStyles.imageCarouselSection}>
                      {<this.generateImages images={this.state.hallImages} />}
                    </div>

                    <div className={ExampleStyles.infoBlock}>
                      <Card bg={'light'} className={ExampleStyles.infoCard}>
                        <Card.Header><b>Hall Information:</b></Card.Header>
                        <Card.Body>
                          <Card.Text>
                            <h3>Average Hall Rating: {this.state.hallRating}</h3>
                            <br />
                            <h5>Description:</h5>
                            {this.state.hallDescription}
                            <br />
                            <br />
                            <Button variant="primary" onClick={() => { this.navigateToPage(this.state.hallName) }}>More Info</Button>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>

                  </div>

                </div>

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
    else //List is still loading. 
    {
      return(<LoaderComponent />);
    }
    
  }

}

export default withRouter(ExampleHallPage);