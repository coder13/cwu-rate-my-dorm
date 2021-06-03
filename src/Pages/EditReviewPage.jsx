import firebase from 'firebase/app';
import React, { Component} from "react";
import { withRouter } from "react-router-dom";
import {Form, Col, Button, Row, Alert} from 'react-bootstrap'
import ReviewStyles from '../Styles/EditReviewPage.module.css';
import LoaderComponent from '../Components/LoaderComponent.jsx';
import * as firestore from '../firestore.js';
import trashCan from '../Assets/trash.png';

class EditReviewPage extends Component {
  

  constructor(props)
  {
    super(props);

    //Set the states:
    
    this.state = {
      revId: this.props.location.state.revId,
      hallNames: [],
      hallName: this.props.location.state.hallName, //this will be the most up to date hall name
      oldHallName: null, //this is the initial hall name that gets passed in
      firstQuarterYear: null,
      firstQuarterSeason: null,
      lastQuarterYear: null,
      lastQuarterSeason: null,
      roomType: null,
      roomTypes: null,
      floorNum: null,
      floors: null,
      reviewText: null,
      image: [], //files selected only, no url
      urls: null, //this is where the images that get added to images will be added once the review is submitted
      overallRating: null, //this will be the most p to date overall rating, this might get updated
      locationRating: null,
      roomSizeRating: null,
      furnitureRating: null,
      commonAreasRating: null,
      cleanlinessRating: null,
      bathroomRating: null,
      likes:null,
      showSuccessAlert: false,
      addedImages: [], // this will be the temporary urls for images added in this edit, this is like a copy of image but with temp urls instead of files, this and images will be the same
      oldUrls: [] //this will be like a copy of urls, we will use these to display the previous images, files from image do not get added here, both this and urls will be the same we need this copy to avoid showing duplicates when images from image get added to urls 
    }
    this.updateReview = this.updateReview.bind(this);
    

  }

 async updateReview() 
  {

    //Add review to firebase:

    var i;
    for(i=0; i<this.state.image.length; i++){
      if (this.state.image[i] !== undefined){
        var imgUrl = await firestore.uploadImage(this.state.image[i]); //add to storage and dorm document, returns url
        this.setState(({ //add url to urls
          urls: [...this.state.urls, imgUrl]
        })) 
      }
    }
    
    if(this.state.hallName !== this.state.oldHallName){ //if the hall changed, then we want to delete review and create new one in the collection of the new hall
      firestore.newReview(this.state.hallName, firebase.auth().currentUser.displayName, firebase.auth().currentUser.uid,  //creates a new review 
      firebase.auth().currentUser.email,[this.state.firstQuarterYear, this.state.firstQuarterSeason], 
      [this.state.lastQuarterYear, this.state.lastQuarterSeason], this.state.roomType, this.state.floorNum,
      this.state.reviewText,this.state.urls, this.state.overallRating, this.state.locationRating, this.state.roomSizeRating,
      this.state.furnitureRating, this.state.commonAreasRating,this.state.cleanlinessRating, this.state.bathroomRating, 
      this.state.likes);

      firestore.deleteReview(this.state.oldHallName, this.state.revId); //will delete review 
    
    }else{
      firestore.editReview (this.state.revId, this.state.hallName, [this.state.firstQuarterYear, this.state.firstQuarterSeason], 
      [this.state.lastQuarterYear, this.state.lastQuarterSeason], this.state.roomType, this.state.floorNum, this.state.reviewText, 
      this.state.urls, this.state.overallRating, this.state.locationRating, this.state.roomSizeRating, this.state.furnitureRating, 
      this.state.commonAreasRating, this.state.cleanlinessRating, this.state.bathroomRating, this.state.likes);
    }
  
    //prompt user that review was submitted:
    this.setState({ showSuccessAlert: true });

  }

  navigateToPage(Page) {
    this.props.history.push({pathname: Page});
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user == null)
        this.navigateToPage("signin");
    });


    firestore.getDormNames().then((names) => {
      this.setState({ hallNames: names });
    }).then(()=>{
      firestore.getDormByName(this.state.hallName).then((dormNameResult) =>{
        this.setState({roomTypes: dormNameResult.get("roomTypes")});
        var numFloors = dormNameResult.get('floors');
        let floors = [];
        var x = 1;
        while (x <= numFloors)
        {
          floors.push(x);
          x++;
        }
        this.setState({floors: floors});
      }).then(() =>{
        firestore.getReviewById(this.state.hallName, this.state.revId).then((review) =>{
          this.setState({hallName : review.get("dormName")});
          this.setState({oldHallName : review.get("dormName")});
          this.setState({firstQuarterYear : review.get("firstQuarterYear")});
          this.setState({firstQuarterSeason : review.get("firstQuarterSeason")});
          this.setState({lastQuarterYear : review.get("lastQuarterYear")});
          this.setState({lastQuarterSeason : review.get("lastQuarterSeason")});
          this.setState({roomType : review.get("roomType")});
          this.setState({floorNum : review.get("floor")});
          this.setState({reviewText : review.get("review")});
          this.setState({urls : review.get("images")});
          this.setState({oldUrls : review.get("images")});
          this.setState({overallRating : review.get("overallRating")});
          this.setState({locationRating : review.get("locationRating")});
          this.setState({roomSizeRating : review.get("roomSizeRating")});
          this.setState({furnitureRating : review.get("furnitureRating")});
          this.setState({commonAreasRating : review.get("commonAreasRating")});
          this.setState({cleanlinessRating : review.get("cleanlinessRating")});
          this.setState({bathroomRating : review.get("bathroomRating")});
          this.setState({likes : review.get("likes")});
          this.setState({loaded: true});
        });
      });

    });

  }

  dormChanged(e) { 
    // Updates roomTypes and floors when the dorm is changed
    if (e.target.value !== "") {
      var numFloors = 0;
      firestore.getDormByName(e.target.value).then((doc) => {
        this.setState({hallName: doc.get('name')});
        numFloors = doc.get('floors');
        var x = 1;
        let floors = [];

        while (x <= numFloors)
        {
          floors.push(x);
          x++;
        }

        this.setState({ floors });

        this.setState({roomTypes: doc.get('roomTypes')});

        this.setState({hallChange: true});

      });
    }
    else this.setState({hallName: e.target.value});
  }

  async addImage(event){
    if ((this.state.image.length + this.state.urls.length) >= 5) {
      console.log("File limit reached.")
    }
    else if (event.target.files[0].size > 2000000) {
      console.log("Files cannot exceed 2MB")
    } else{
      if(event.target.files[0] !== undefined){
        this.setState(({ //add url to image so it can get added to urls when review is submitted
          image: [...this.state.image, event.target.files[0]]
        })) 
        
        this.setState(({ //add temporary image url to images we want to display
          addedImages: [...this.state.addedImages, URL.createObjectURL(event.target.files[0])]
        }))
      }
    }
  }

  //delete image from document/ states/ storage
  deleteImage(imageUrl){
    alert("This image will be deleted");
    var urlArray = [...this.state.urls]; 
    var oldUrlArray = [...this.state.oldUrls]; 
    var urlIndex = urlArray.indexOf(imageUrl)
    if (urlIndex !== -1) { //check if image was already in document (urls) and delete from url array
      urlArray.splice(urlIndex, 1);
      oldUrlArray.splice(urlIndex,1); //since old urls and urls are a copy of each other, we can delete from the same place
      this.setState({urls: urlArray});
      this.setState({oldUrls: urlArray});
      firestore.deleteImage(imageUrl);//delete image from storage
    }else{ //if image is not yet in the document
      var fileArray = [...this.state.image]; 
      var addedImages = [...this.state.addedImages];
      var imageIndex = addedImages.indexOf(imageUrl);
      if(imageIndex !==-1){ //check if image was added in this edit and delete from image array and from array of images we want to display
        addedImages.splice(imageIndex, 1); //since image and added image are a copy of each other we can delete from the same place
        fileArray.splice(imageIndex, 1);
        this.setState({image:fileArray});
        this.setState({addedImages:addedImages});
      }
    }

  }

  renderImage(imageUrl) {
    return (
      <div className = {ReviewStyles.imageBlock} key={imageUrl}>
        <img className={ReviewStyles.imageBorder} src={imageUrl} alt = ""/>
        <div className={ReviewStyles.trash}>
          <img className={ReviewStyles.trashBtn} src={trashCan} alt = "delete" onClick={() => { this.deleteImage(imageUrl)}} width={44} height={44}/>
        </div>
      </div>
    );
  }

  
  render()
  {
    if (this.state.loaded) {

    return (
      <div className={ReviewStyles.mainDivSection}> 

        <div className={ReviewStyles.mainContainerSection}>
          
          <div className={ReviewStyles.sideSection}></div>

         {/* <div className={ReviewStyles.mainContent}> */}
         <div className ={ReviewStyles.titleBlock}>Edit Review:</div>

    

            <div className={ReviewStyles.middleRow}>

              <div className={ReviewStyles.leftRowSide}>
                
                {/*<div className={ReviewStyles.reviewTitleBlock}>
                  <h1>Edit Review:</h1>
                </div> */}

                <div className={ReviewStyles.reviewDropDown}>

                  <Form className={ReviewStyles.form}>

                    <Form.Group controlId="">
                      <Form.Row>
                        <Form.Label column lg={2}>
                          Hall: 
                        </Form.Label>
                        <Col>
                          <Form.Control 
                            as="select" 
                            defaultValue={this.state.hallName}
                            onChange={e => this.dormChanged(e)}
                          >
                            <option value="">Choose...</option>
                            {this.state.hallNames.map(dorm => (<option key={dorm}>{dorm}</option>))}

                          </Form.Control>
                        </Col>
                      </Form.Row>

                      <br />

                      <Form.Row>
                        <Form.Label column lg={3}>
                          First Quarter: 
                        </Form.Label>
                        <Col>
                            <Form.Control 
                              as="select" 
                              defaultValue={this.state.firstQuarterSeason}
                              onChange={e => this.setState({firstQuarterSeason: e.target.value})}
                            >
                              <option value="">Quarter...</option>
                              <option>Spring</option>
                              <option>Summer</option>
                              <option>Fall</option>
                              <option>Winter</option>

                            </Form.Control>
                            </Col>
                            <Col>
                            <Form.Control 
                              as="select" 
                              defaultValue={this.state.firstQuarterYear}
                              onChange={e => this.setState({firstQuarterYear: parseInt(e.target.value)})}
                            >
                              <option  value="0">Year...</option>
                              {(()=>{
                                var years = [new Date().getFullYear()];
                                var dif = 0;
                                while (dif < 20) {
                                  dif++;
                                  years.push(years[years.length-1] - 1);
                                }
                                return years.map(year => (<option key={year}>{year}</option>));

                              })()}

                            </Form.Control>
                        </Col>
                      </Form.Row>

                      <br />

                      <Form.Row>
                        <Form.Label column lg={3}>
                          Last Quarter: 
                        </Form.Label>
                        <Col>
                        <Form.Control 
                              as="select" 
                              defaultValue={this.state.lastQuarterSeason}
                              onChange={e => this.setState({lastQuarterSeason: e.target.value})}
                            >
                              <option  value="">Quarter...</option>
                              <option>Spring</option>
                              <option>Summer</option>
                              <option>Fall</option>
                              <option>Winter</option>

                            </Form.Control>
                            </Col>
                            <Col>
                            <Form.Control 
                              as="select" 
                              defaultValue={this.state.lastQuarterYear}
                              onChange={e => this.setState({lastQuarterYear: parseInt(e.target.value)})}
                            >
                              <option value="0">Year...</option>
                              {(()=>{
                                var years = [new Date().getFullYear()];
                                var dif = 0;
                                while (dif < 20) {
                                  dif++;
                                  years.push(years[years.length-1] - 1);
                                }
                                return years.map(year => (<option key={year}>{year}</option>));

                              })()}

                            </Form.Control>
                        </Col>
                      </Form.Row>

                      <br />

                      <Form.Row>
                        <Form.Label column lg={3}>
                          Room Type: 
                        </Form.Label>
                        <Col>
                          <Form.Control 
                            as="select" 
                            defaultValue={this.state.roomType}
                            disabled={this.state.hallName === ""}
                            onChange={e => this.setState({roomType: e.target.value})}
                          >
                            <option value="">Choose...</option>
                            {this.state.roomTypes.map(type => (<option key={type}>{type}</option>))}

                          </Form.Control>
                        </Col>
                      </Form.Row>

                      <br />

                      <Form.Row>
                        <Form.Label column lg={2}>
                          Floor: 
                        </Form.Label>
                        <Col>
                          <Form.Control 
                            as="select" 
                            defaultValue={this.state.floorNum}
                            disabled={this.state.hallName === ""}
                            onChange={e => this.setState({floorNum: parseInt(e.target.value)})}
                          >
                            <option  value="0">Choose...</option>
                            {this.state.floors.map(floor => (<option key={floor} value={floor}>Floor {floor}</option>))}
                          </Form.Control>
                        </Col>
                      </Form.Row>

                    </Form.Group>

                  </Form>
                
                </div>

                <div className={ReviewStyles.reviewText}>
                  <Form className={ReviewStyles.form}>
                    <Form.Group>

                      <Form.Label>
                        Review: 
                      </Form.Label>
                      <Form.Control 
                        as="textarea" 
                        defaultValue = {this.state.reviewText}
                        rows={7} 
                        onChange={e => this.setState({reviewText: e.target.value})}
                      />
                    
                    </Form.Group>
                  </Form>
                </div>

                <div className={ReviewStyles.reviewImages}>
                  <Form className={ReviewStyles.form}>
                    <Form.Group>
                      <Form.File 
                        id="exampleFormControlFile1" 
                        label="Add images"
                        onChange={e => 

                          {this.addImage(e)}

                        }
                      />
                    </Form.Group>
                  </Form>
                  {this.state.urls.length + this.state.image.length} / 5
                </div>


              </div>

              <div className={ReviewStyles.rightRowSide}>
                <div className={ReviewStyles.sliderSection}>

                  <div className={ReviewStyles.sliderBox}>
                    <Form className={ReviewStyles.form}>
                      <Form.Group controlId="">
                          <Form.Label>
                            Overall Rating:
                          </Form.Label>
                          <Form.Row>
                            <Col>
                              <Form.Control 
                                type="range"
                                max="10"
                                defaultValue = {this.state.overallRating}
                                onChange={e => this.setState({overallRating: e.target.value})} 
                              />
                            </Col>
                            <Col lg={1}>
                              {this.state.overallRating}
                            </Col>
                          </Form.Row>
                      </Form.Group>

                      <Form.Group controlId="">
                          <Form.Label>
                            Location Rating:
                          </Form.Label>
                          <Form.Row>
                            <Col>
                              <Form.Control 
                                type="range"
                                max="10"
                                defaultValue = {this.state.locationRating}
                                onChange={e => this.setState({locationRating: e.target.value})} 
                              />
                            </Col>
                            <Col lg={1}>
                              {this.state.locationRating}
                            </Col>
                          </Form.Row>
                      </Form.Group>

                      <Form.Group controlId="">
                          <Form.Label>
                            Room Size Rating:
                          </Form.Label>
                          <Form.Row>
                            <Col>
                              <Form.Control 
                                type="range"
                                max="10"
                                defaultValue = {this.state.roomSizeRating}
                                onChange={e => this.setState({roomSizeRating: e.target.value})} 
                              />
                            </Col>
                            <Col lg={1}>
                              {this.state.roomSizeRating}
                            </Col>
                          </Form.Row>
                      </Form.Group>

                      <Form.Group controlId="">
                          <Form.Label>
                            Furniture Rating:
                          </Form.Label>
                          <Form.Row>
                            <Col>
                              <Form.Control 
                                type="range"
                                max="10"
                                defaultValue = {this.state.furnitureRating}
                                onChange={e => this.setState({furnitureRating: e.target.value})} 
                              />
                            </Col>
                            <Col lg={1}>
                              {this.state.furnitureRating}
                            </Col>
                          </Form.Row>
                      </Form.Group>

                      <Form.Group controlId="">
                          <Form.Label>
                            Common Areas Rating:
                          </Form.Label>
                          <Form.Row>
                            <Col>
                              <Form.Control 
                                type="range"
                                max="10"
                                defaultValue = {this.state.commonAreasRating}
                                onChange={e => this.setState({commonAreasRating: e.target.value})} 
                              />
                            </Col>
                            <Col lg={1}>
                              {this.state.commonAreasRating}
                            </Col>
                          </Form.Row>
                      </Form.Group>

                      <Form.Group controlId="">
                          <Form.Label>
                            Cleanliness Rating:
                          </Form.Label>
                          <Form.Row>
                            <Col>
                              <Form.Control 
                                type="range"
                                max="10"
                                defaultValue = {this.state.cleanlinessRating}
                                onChange={e => this.setState({cleanlinessRating: e.target.value})} 
                              />
                            </Col>
                            <Col lg={1}>
                              {this.state.cleanlinessRating}
                            </Col>
                          </Form.Row>
                      </Form.Group>

                      <Form.Group controlId="">
                          <Form.Label>
                            Bathroom Rating:
                          </Form.Label>
                          <Form.Row>
                            <Col>
                              <Form.Control 
                                type="range"
                                max="10"
                                defaultValue = {this.state.bathroomRating}
                                onChange={e => this.setState({bathroomRating: e.target.value})} 
                              />
                            </Col>
                            <Col lg={1}>
                              {this.state.bathroomRating}
                            </Col>
                          </Form.Row>
                      </Form.Group>
                      
                    </Form>
                  </div>

                </div>

              </div>

            </div>
                

            <div className = {ReviewStyles.bottomSection}>
                <div className = {ReviewStyles.imagesRow}>
                  
                  {this.state.oldUrls.map(url => this.renderImage(url))}
                  {this.state.addedImages.map(img => this.renderImage(img))}


                </div>

                <div>

                <style type="text/css">
                    {`
                .btn-submit {
                  width: 330px;
                  height: 110px;
                  background-color: #A30F32;
                  font-size: 1.5rem;
                  border-radius: 5px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 4px 4px #838383;
                  color: white;
                  text-align: center;
                  cursor: pointer;
                }
                .btn-submit:hover{
                  color: white;
                  background-color: #820d28;
                }
                .btn-submit[disabled] {
                  cursor: default;
                }
                .btn-xxl {
                  padding: 1rem 1.5rem;
                  font-size: 2.3rem;
                }
                `}
                  </style>
                </div>

          

                <div className={ReviewStyles.buttonSection}>
                  <Button variant="submit" 
                    disabled={this.state.hallName === "" || this.state.firstQuarterSeason === ""
                      || this.state.firstQuarterYear === 0 || this.state.lastQuarterSeason === ""
                      || this.state.lastQuarterYear === 0 || this.state.roomType === ""
                      || this.state.floorNum === 0 || this.state.reviewText === ""} 
                    onClick={this.updateReview} 
                    size="xxl"
                  >
                    Update Review
                  </Button>
                  <Row>
                    {this.state.showSuccessAlert && (<Col className={ReviewStyles.submitAlert}>
                      <Alert className={ReviewStyles.successAlert} variant="success" onClick={()=> {this.navigateToPage("/profile")}} dismissible onClose={() => this.setState({ showSuccessAlert: false })}>
                        <Alert.Heading>Review Updated! Return to profile page</Alert.Heading>
                      </Alert>
                    </Col>)}
                  </Row>
                </div>

            </div>

          {/*</div>*/}

              
      
        </div>

        

      </div>
    )
                    }
    else //List is still loading. 
    {
      return (<LoaderComponent />);
    }
  }

}

export default withRouter(EditReviewPage);
