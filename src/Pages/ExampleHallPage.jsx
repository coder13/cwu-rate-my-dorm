import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {getReviewsByDormName, getDormByName, getRatings, likeOrUnlikeReview} from '../firestore'
import {Container, Row, Carousel, Card, Button} from 'react-bootstrap'
import LoaderComponent from '../Components/LoaderComponent';
import ExampleStyles from '../Styles/ExampleHallPage.module.css';
import { auth } from "../firebase";

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
      liked: {},
      numLikes: {},
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

    }).then(()=>{
      // Determine if user has 'liked' reviews, and total number of likes per review
      const newNumLikes = {};
      const newLiked = {};
      this.state.hallReviews.forEach(review => {
        if (!auth.currentUser) {
          newLiked[review.id] = false;
          newNumLikes[review.id] = review.get('likes')
        }
        else if (review.get('usersLiked')) {
          if (review.get('usersLiked').includes(auth.currentUser.uid)) {
            console.log(review.get('usersLiked'))
            newLiked[review.id] = true
          }
          else {
            newLiked[review.id] = false
          }
          newNumLikes[review.id] = review.get('likes')
        }       
        else {
          newLiked[review.id] = false
          newNumLikes[review.id] = 0
        }
      });
      this.setState({numLikes: newNumLikes, liked: newLiked})
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

  //===likeButtonHandler===
  likeButtonHandler(curReview) {

    if (auth.currentUser) {
      likeOrUnlikeReview(curReview.id, curReview.get('dormName'));
      const newLiked = this.state.liked;

      if (newLiked[curReview.id])
        newLiked[curReview.id] = false
      else
        newLiked[curReview.id] = true
      this.setState({liked: newLiked})

      const newNumLikes = this.state.numLikes;
      if (this.state.liked[curReview.id])
        newNumLikes[curReview.id] = this.state.numLikes[curReview.id] + 1;
      else 
        newNumLikes[curReview.id] = this.state.numLikes[curReview.id] - 1;
      this.setState({numLikes: newNumLikes})
    }
    else {
      this.props.history.push({pathname: "/signin"});
    }
  }

  //===generateReviews===
  //Desc: Genereates reviews from database values.
  generateReviews(props) 
  {
    const reviewsToAdd = props.reviews;



    if(reviewsToAdd <= 0)
    {
      return(
        <div className={ExampleStyles.reviewsBlock}>
          <h5>No Reviws Yet...</h5>
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

            <div className = {ExampleStyles.likeButton}>
              <button type="button" className={this.state.liked[curReview.id] ? "btn btn-success btn-sm" : "btn btn-sm"} 
                onClick={(() => this.likeButtonHandler(curReview))}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
              </svg> {this.state.numLikes[curReview.id]}</button>
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

          <div className = {ExampleStyles.likeButton}>
            <button type="button" className={this.state.liked[curReview.id] ? "btn btn-success btn-sm" : "btn btn-sm"} 
              onClick={(() => this.likeButtonHandler(curReview))}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
            </svg> {this.state.numLikes[curReview.id]}</button>
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
                          
                          <div className={ExampleStyles.infoCardOverall}>
                            Average Hall Rating: {this.state.overallRatingTotal}
                          </div>

                          <div className={ExampleStyles.infoCardSub}>
                            <p>
                              Location Rating: {this.state.locationRatingTotal}<br/>
                              Room Size Rating: {this.state.roomSizeRatingTotal}<br/>
                              Furiture Rating: {this.state.furnitureRatingTotal}<br/>
                              Common Areas Rating: {this.state.commonAreasRatingTotal}<br/>
                              Cleanliness Rating: {this.state.cleanlinessRatingTotal}<br/>
                              Bathroom Rating: {this.state.bathroomRatingTotal}<br/>
                            </p>
                          </div>

                          <Card.Text>

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