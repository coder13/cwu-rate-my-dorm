import firebase from 'firebase/app';
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Form, Col, Row, Button, Alert} from 'react-bootstrap'
import ReviewStyles from '../Styles/ReviewPage.module.css';
import LoaderComponent from '../Components/LoaderComponent.jsx';
import withEmailVerification from '../hooks/withEmailVerification';
import * as firestore from '../firestore.js';

class ReviewPage extends Component {


  constructor(props)
  {
    super(props);

    //Set the states:
    this.state = {
      hallNames: [],
      hallName: "",
      firstQuarterYear: 0,
      firstQuarterSeason: "",
      lastQuarterYear: 0,
      lastQuarterSeason: "",
      roomType: "",
      roomTypes: [],
      floorNum: 0,
      floors: [],
      reviewText:"",
      image: [], //files selected only, no url
      prevUrls: [],
      urls: [],
      overallRating: 5,
      locationRating: 5,
      roomSizeRating: 5,
      furnitureRating: 5,
      commonAreasRating: 5,
      cleanlinessRating: 5,
      bathroomRating: 5,
      likes: 0,
      reviewID: "",
      showSuccessAlert: false,
      showMoveOutAlert: false,
      showExistingReviewAlert: false,
      showFileLimit: false
    }

    this.submitReview = this.submitReview.bind(this);

  }

  async submitReview()
  {

    // Check that move-in date is before move-out date
    var firstSeasonVal, lastSeasonVal;
    if (this.state.firstQuarterSeason === "Spring") firstSeasonVal = 0
    else if (this.state.firstQuarterSeason === "Summer") firstSeasonVal = 1
    else if (this.state.firstQuarterSeason === "Fall") firstSeasonVal = 2
    else if (this.state.firstQuarterSeason === "Winter") firstSeasonVal = 3

    if (this.state.lastQuarterSeason === "Spring") lastSeasonVal = 0
    else if (this.state.lastQuarterSeason === "Summer") lastSeasonVal = 1
    else if (this.state.lastQuarterSeason === "Fall") lastSeasonVal = 2
    else if (this.state.lastQuarterSeason === "Winter") lastSeasonVal = 3

    if (this.state.firstQuarterYear > this.state.lastQuarterYear
      || (this.state.firstQuarterYear === this.state.lastQuarterYear && firstSeasonVal > lastSeasonVal)) {
      this.setState({ showMoveOutAlert: true });
    } else {
      //Add review to firebase:

      //get url array
      var i;
      for(i=0; i<this.state.image.length; i++){
        if(this.state.image[i] !== undefined){ //checks if file was selected
          var imgUrl = await firestore.uploadImage(this.state.hallName, this.state.image[i]); //add to storage and dorm document, returns url
          this.setState(({ //add url to urls
            urls: [...this.state.urls, imgUrl]
          }))
        }
      }

      //create a new review
      firestore.newReview(this.state.hallName, firebase.auth().currentUser.displayName, firebase.auth().currentUser.uid, firebase.auth().currentUser.email,
      [this.state.firstQuarterYear, this.state.firstQuarterSeason], [this.state.lastQuarterYear, this.state.lastQuarterSeason], this.state.roomType, this.state.floorNum,this.state.reviewText, 
      this.state.urls, this.state.overallRating, this.state.locationRating, this.state.roomSizeRating, this.state.furnitureRating, this.state.commonAreasRating, 
      this.state.cleanlinessRating, this.state.bathroomRating, this.state.likes);


      //prompt user that review was submitted:
      this.setState({ showSuccessAlert: true });
    }
  }

  navigateToPage(Page) {
    this.props.history.push({pathname: Page});
  }

  componentDidMount() {

    //Set Tab Name:
    document.title = "Review Page";

    firebase.auth().onAuthStateChanged((user)=>{
      if (user == null)
        this.navigateToPage("signin");
    });

    
    this.setState(firestore.getDormNames().then((names) => {
      this.setState({ hallNames: names });
      this.setState({ loaded: true });
    }));

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

      });
    }
    else this.setState({hallName: e.target.value});
    // Detects if user has already reviewed dorm, then links them to the edit page
    firestore.getReviewIDByDormNameAndUser(e.target.value, firebase.auth().currentUser.email).then((id) => {
      if (id != null) {
        this.setState({ 
          reviewID: id,
          showExistingReviewAlert: true })
      }
      else {
        this.setState({ showExistingReviewAlert: false })
      }
    });
  }

  addImageHandler(e) {
    // Checks against each image to prevent duplicates
    var duplicateImage = false;
    for(var i=0; i<this.state.image.length; i++) {
      if (e.target.files[0].name === this.state.image[i].name)
        duplicateImage = true;
    } 
    if (!duplicateImage) {
        // Limits images to 5 max
        if (this.state.image.length >= 5) {
          console.log("File limit reached.")
          this.setState({showFileLimit: false})
        }
        // Limits file size to 2 MB
        else if (e.target.files[0].size > 2000000) {
          console.log("Files cannot exceed 2MB")
          this.setState({showFileLimit: true})
        } 
        else {
        this.setState(prevState =>({
          showFileLimit: false,
          image:[...prevState.image, e.target.files[0]],
          prevUrls:[...prevState.prevUrls, URL.createObjectURL(e.target.files[0])]
        }))
      }
    }
  }

  removeImageHandler(imgUrl) {
    var i = this.state.prevUrls.indexOf(imgUrl);
    var filteredImage = this.state.image.slice(0,i).concat(this.state.image.slice(i + 1, this.state.image.length))
    var filteredUrls = this.state.prevUrls.filter(url => url !== imgUrl)
    this.setState({
      image: filteredImage,
      prevUrls: filteredUrls
    })

  }

  render()
  {
    if (this.state.loaded) {

      return (
        <div className={ReviewStyles.mainDivSection}>
          <div className={ReviewStyles.mainContainerSection}>

            <div className={ReviewStyles.sideSection}></div>
            <div className= {ReviewStyles.reviewTitleBlock}> 
                  Write a Review:
                </div>
            <div className={ReviewStyles.content}>
        
              <div className={ReviewStyles.leftContentSide}>



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
                            defaultValue="Choose..."
                            onChange={e => this.dormChanged(e)}
                          >
                            <option noValidate validated="true" value="">Choose...</option>
                            {this.state.hallNames.map(dorm => (<option key={dorm}>{dorm}</option>))}

                          </Form.Control>
                          {this.state.showExistingReviewAlert && (<Col md={{ span: 20, offset: 0 }}>
                            <Alert variant="success" onClick={()=> {this.navigateToPage(("/EditReviewPage/" + this.state.reviewID + "/" + this.state.hallName))}}  className={ReviewStyles.successAlert}>
                              Click here to start editing this review!
                            </Alert>
                          </Col>)}
                        </Col>
                      </Form.Row>

                      <br />

                      <Form.Row>
                        <Form.Label column lg={4}>
                          Move-in Quarter:
                      </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            defaultValue="Quarter..."
                            onChange={e => this.setState({firstQuarterSeason: e.target.value, showMoveOutAlert: false})}
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
                            defaultValue="Year..."
                            onChange={e => this.setState({firstQuarterYear: parseInt(e.target.value), showMoveOutAlert: false})}
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
                        <Form.Label column lg={4}>
                          Move-out Quarter:
                      </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            defaultValue="Quarter..."
                            onChange={e => this.setState({lastQuarterSeason: e.target.value, showMoveOutAlert: false})}
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
                            defaultValue="Year..."
                            onChange={e => this.setState({lastQuarterYear: parseInt(e.target.value), showMoveOutAlert: false})}
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
                        {this.state.showMoveOutAlert && (<Col md={{ span: 12, offset: 0 }}>
                          <Alert variant="danger" className={ReviewStyles.dangerAlert} dismissible onClose={() => this.setState({ showMoveOutAlert: false })}>
                            Move-in date cannot be later than move-out date
                          </Alert>
                        </Col>)}
                      </Form.Row>

                      <br />

                      <Form.Row>
                        <Form.Label column lg={4}>
                          Room Type:
                      </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            defaultValue="Choose..."
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
                            defaultValue="Choose..."
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
                        rows={7}
                        onChange={e => this.setState({reviewText: e.target.value})}
                      />

                    </Form.Group>
                  </Form>
                </div>

                <div className={ReviewStyles.reviewImages}>
                  <Form className={ReviewStyles.imageInput}>
                    <Form.Group>
                      <Form.File
                        id="exampleFormControlFile1"
                        label="Add Pictures"
                        onChange={e => this.addImageHandler(e)}
                      />
                    </Form.Group>
                  </Form>
                  {this.state.image.length}/5 
                </div>
                {this.state.showFileLimit && (<p className={ReviewStyles.fileLimitWarning}>Images cannot be more than 2 megabytes</p>)}

                <div className = {ReviewStyles.imagesContainer}>
                  {this.state.prevUrls.map(imgUrl => 
                  <div className = {ReviewStyles.imageButtonContainer} key={imgUrl}>
                    <img className = {ReviewStyles.imagePreview} src = {imgUrl} alt = ""/>
                    <div className={ReviewStyles.imageCloseButton}>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => this.removeImageHandler(imgUrl)}>X</button> 
                    </div>
                  </div>)}
                </div>
              </div>

              <div className={ReviewStyles.rightContentSide}>
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
                              onChange={e => this.setState({overallRating: e.target.value})}
                            />
                          </Col>
                            {this.state.overallRating}
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
                              onChange={e => this.setState({locationRating: e.target.value})}
                            />
                          </Col>
                            {this.state.locationRating}
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
                              onChange={e => this.setState({roomSizeRating: e.target.value})}
                            />
                          </Col>
                            {this.state.roomSizeRating}
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
                              onChange={e => this.setState({furnitureRating: e.target.value})}
                            />
                          </Col>
                          {this.state.furnitureRating}
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
                              onChange={e => this.setState({commonAreasRating: e.target.value})}
                            />
                          </Col>
                            {this.state.commonAreasRating}
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
                              onChange={e => this.setState({cleanlinessRating: e.target.value})}
                            />
                          </Col>
                            {this.state.cleanlinessRating}
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
                              onChange={e => this.setState({bathroomRating: e.target.value})}
                            />
                          </Col>
                            {this.state.bathroomRating}
                        </Form.Row>
                      </Form.Group>

                    </Form>
                  </div>

                </div><div>
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
                      || this.state.floorNum === 0 || this.state.reviewText === "" 
                      || this.state.showExistingReviewAlert === true || this.state.showMoveOutAlert === true} 
                      // Commented above prevents user from uploading a review if they already have one created
                    onClick={this.submitReview}
                    size="xxl"
                  >
                    Submit
                </Button>
                </div>
                <Row>
                  {this.state.showSuccessAlert && (<Col className={ReviewStyles.submitAlert}>
                    <Alert className={ReviewStyles.successAlert} variant="success" dismissible onClose={() => this.setState({ showSuccessAlert: false })}>
                      <Alert.Heading>Review submitted!</Alert.Heading>
                    </Alert>
                  </Col>)}
                </Row>

              </div>

            </div>

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

export default withEmailVerification(withRouter(ReviewPage));
