import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AdminPageStyles from '../Styles/AdminPageStyles.module.css'
import {Container, Button} from 'react-bootstrap'
import { getAllReviews } from '../firestore'
import LoaderComponent from '../Components/LoaderComponent'
import XButton from '../Assets/xButton.png'

class Admin extends Component {

  constructor(props){
    super(props);
    this.state = {
      allReviews: null,
      loaded: false,
      currentUserImage: null,
      displayCurUserImage: false
    }

    this.generateReviews = this.generateReviews.bind(this);
    this.generateUserImages = this.generateUserImages.bind(this);
    this.userImagePopup = this.userImagePopup.bind(this);
  }

  componentDidMount()
  {
    //Load in all reviews to a state:
    getAllReviews()
      .then((result) => {
        this.setState({allReviews: result});
        this.setState({loaded: true})
      });
  }

  userImagePopup() 
  {
    return (
      <div className={AdminPageStyles.userImagePopUp} onClick={()=>{this.setState({displayCurUserImage: false})}}>
        <img className={AdminPageStyles.userImage} src={this.state.currentUserImage} alt=""/>
        <img className={AdminPageStyles.topcorner} src={XButton} onClick={()=>{this.setState({displayCurUserImage: false})}} alt=""/>
      </div>
    );
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
        <div className={AdminPageStyles.reviewsBlock}>
          <div className={AdminPageStyles.noReviews}>No Reviws Yet...</div>
        </div>
      );
    }

    const toReturn = reviewsToAdd.map((curReview) =>
      curReview.get("images").length > 0 ? 
        <div key={curReview.id} className={AdminPageStyles.reviewTemplate}>
          <div className={AdminPageStyles.reviewTemplateTitle}>
            <div className={AdminPageStyles.reviewAuthor}>Author</div>
            {": " + curReview.get("author")}
          </div>

          <div className={AdminPageStyles.reviewTemplateRating}>
            <div className={AdminPageStyles.reviewRating}>Overall Rating</div>
            {": " +curReview.get("overallRating")}
          </div>

          <div className={AdminPageStyles.reviewTemplateBody}>

            <div className={AdminPageStyles.reviewTemplateDesc}>
              {curReview.get("review")}
            </div>

            <div className={AdminPageStyles.reviewTemplateImages}>

              {this.generateUserImages(curReview.get("images"))}

            </div>

            <div className = {AdminPageStyles.reviewButtonBox}>
              <Button onClick={()=> {alert("Needs Firestore Func.")}} className ={AdminPageStyles.deleteButton} variant="danger">Delete</Button>
            </div>

          </div>

        </div>
       : 
        <div key={curReview.id} className={AdminPageStyles.reviewTemplate}>
          
          <div className={AdminPageStyles.reviewTemplateTitle}>
            <div className={AdminPageStyles.reviewAuthor}>Author</div>
            {": " + curReview.get("author")}
          </div>

          <div className={AdminPageStyles.reviewTemplateRating}>
            <div className={AdminPageStyles.reviewRating}>Overall Rating</div>
            {": " +curReview.get("overallRating")}
          </div>

          <div className={AdminPageStyles.reviewTemplateBody}>
            <div className={AdminPageStyles.reviewTemplateDesc}>
              {curReview.get("review")}
            </div>
          </div>

          <div className = {AdminPageStyles.reviewButtonBox}>
            <Button onClick={()=> {alert("Needs Firestore Func.")}} className ={AdminPageStyles.deleteButton} variant="danger">Delete</Button>
          </div>

        </div>
    );

    return(
      <div className={AdminPageStyles.reviewsBlock}>
        {toReturn}
      </div>
    );
  }

  //===generateUserImages===
  //Desc: generates the users images.
  generateUserImages(imageArr)
  {
    const toReturn = imageArr.map((curImage) =>

      <img className={AdminPageStyles.reviewTemplateImageBorder}
        src={curImage}
        alt=""
        key ={curImage}
        onClick={() => { this.setState({ displayCurUserImage: true }); this.setState({ currentUserImage: curImage }); }}
      />

    );

    return(toReturn);
  }

  //===render===
  //Desc: Renders the html.
  render() {
    
    if(this.state.loaded === true)
    {
      return(

        <Container fluid className = {AdminPageStyles.mainContainer}>
          
          {this.state.displayCurUserImage ? <this.userImagePopup/>: null}

          <h1>Number of Reviews: {this.state.allReviews.length}</h1>
          <this.generateReviews reviews = {this.state.allReviews}/>
        </Container>
  
      );
    }
    else
    {
      return(
        <LoaderComponent/>
      );
    }

  }
}

export default withRouter(Admin);