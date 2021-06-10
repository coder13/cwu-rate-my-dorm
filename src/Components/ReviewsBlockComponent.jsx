import React from "react";
import ReviewsStyles from '../Styles/ReviewsBlockComponent.module.css'
import XButton from '../Assets/xButton.png'

class ReviewsBlockComponent extends React.Component {
  constructor(props) {
    super(props); //Call parent constructor.

    this.state = {
      displayCurUserImage: false
    }

    this.generateReviews = this.generateReviews.bind(this);
    this.generateUserImages = this.generateUserImages.bind(this);
    this.userImagePopup = this.userImagePopup.bind(this);
  }

  //===generateReviews===
  //Desc: Generates reviews from database values.
  generateReviews(reviews) 
  {
    if(!reviews || reviews.length <= 0)
    {
      return(
        <div className={ReviewsStyles.reviewsBlock}>
          <div className={ReviewsStyles.noReviews}>No Reviews Yet...</div>
        </div>
      );
    }

    return (
      <div>
        {reviews.map((curReview) => (
          curReview.get("images").length > 0 ? 
            <div key={curReview.id} className={ReviewsStyles.reviewTemplate}>
              <div className={ReviewsStyles.reviewTemplateTitle}>
                <div className={ReviewsStyles.reviewAuthor}>Author</div>
                {": " + curReview.get("author")}
              </div>

              <div className={ReviewsStyles.reviewTemplateRating}>
                <div className={ReviewsStyles.reviewRating}>Overall Rating</div>
                {": " +curReview.get("overallRating")}
              </div>

              <div className={ReviewsStyles.reviewTemplateBody}>

                <div className={ReviewsStyles.reviewTemplateDesc}>
                  {curReview.get("review")}
                </div>

                <div className={ReviewsStyles.reviewTemplateImages}>

                  {this.generateUserImages(curReview.get("images"))}

                </div>

              </div>

            </div>
          : 
            <div key={curReview.id} className={ReviewsStyles.reviewTemplate}>
              
              <div className={ReviewsStyles.reviewTemplateTitle}>
                <div className={ReviewsStyles.reviewAuthor}>Author</div>
                {": " + curReview.get("author")}
              </div>

              <div className={ReviewsStyles.reviewTemplateRating}>
                <div className={ReviewsStyles.reviewRating}>Overall Rating</div>
                {": " +curReview.get("overallRating")}
              </div>

              <div className={ReviewsStyles.reviewTemplateBody}>
                <div className={ReviewsStyles.reviewTemplateDesc}>
                  {curReview.get("review")}
                </div>
              </div>
          
        </div>
        ))}
      </div>
    );
  }

  //===generateUserImages===
  //Desc: generates the users images.
  generateUserImages(imageArr)
  {
    const toReturn = imageArr.map((curImage) =>

      <img className={ReviewsStyles.reviewTemplateImageBorder}
        src={curImage}
        alt=""
        key ={curImage}
        onClick={() => { this.setState({ displayCurUserImage: true }); this.setState({ currentUserImage: curImage }); }}
      />

    );

    return(toReturn);
  }

  //===userImagePopup===
  //Desc: Displays a pop up image for the user.
  userImagePopup() 
  {
    return (
      <div className={ReviewsStyles.userImagePopUp} onClick={()=>{this.setState({displayCurUserImage: false})}}>
        <img className={ReviewsStyles.userImage} src={this.state.currentUserImage} alt=""/>
        <img className={ReviewsStyles.topcorner} src={XButton} onClick={()=>{this.setState({displayCurUserImage: false})}} alt=""/>
      </div>
    );
  }

  //===Render===
  //Desc: Renders html to screen.
  render() {
    
    return(
      <div>
        {this.state.displayCurUserImage ? <this.userImagePopup/>: null}
        {this.generateReviews(this.props.reviews)}
      </div>
    
    );
    
  }

}

export default ReviewsBlockComponent;
