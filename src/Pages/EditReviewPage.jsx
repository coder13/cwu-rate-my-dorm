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
      revId: this.props.match.params.revId,
      hallNames: [],
      hallName: this.props.match.params.hallName,
      oldHallName: null, //this will be the initial hall name in the review
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
      urls: null, //this is where the images that get added to image will be added once the review is submitted
      overallRating: null, 
      locationRating: null,
      roomSizeRating: null,
      furnitureRating: null,
      commonAreasRating: null,
      cleanlinessRating: null,
      bathroomRating: null,
      likes:null,
      showSuccessAlert: false,
      addedImages: [], // these will be the temporary urls for images added in this edit, this is a copy of image but with temporary urls instead of files
      oldUrls: [], //this will be a copy of urls, files from image will not get added here, these are the old reviewe images that get displayed, we need this copy to avoid displaying duplicates when images from image get added to urls 
      urlsToDelete: [], //these will be the urls we are going to delete from the storage
      showImageSizeAlert: false,
      showImageLimitAlert: false,
      showMoveOutAlert: false,
      showExistingReviewAlert: false,
      existingReviewId: null,
      invalidRoomType: false,
      invalidFloor: false
    }

    this.updateReview = this.updateReview.bind(this);
    this.existingReview = this.existingReview.bind(this);

  }

 async updateReview() 
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
    } else{
      //Add images to storage and to the url array which will be the images array in the review document:
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

        firestore.deleteReviewOnly(this.state.oldHallName, this.state.revId); //deletes review in the old hall collection
      
      }else{
        firestore.editReview (this.state.revId, this.state.hallName, [this.state.firstQuarterYear, this.state.firstQuarterSeason], 
        [this.state.lastQuarterYear, this.state.lastQuarterSeason], this.state.roomType, this.state.floorNum, this.state.reviewText, 
        this.state.urls, this.state.overallRating, this.state.locationRating, this.state.roomSizeRating, this.state.furnitureRating, 
        this.state.commonAreasRating, this.state.cleanlinessRating, this.state.bathroomRating, this.state.likes);
      }
    
      //prompt user that review was submitted:
      this.setState({ showSuccessAlert: true });

      //delete unnecessary urls from storage
      var x;
      for(x=0;x<this.state.urlsToDelete.length; x++){
        firestore.deleteImage(this.state.urlsToDelete[x]);
      }
    }
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
          this.setState({hallName : review.get("dormName"),
          oldHallName : review.get("dormName"),
          firstQuarterYear : review.get("firstQuarterYear"),
          firstQuarterSeason : review.get("firstQuarterSeason"),
          lastQuarterYear : review.get("lastQuarterYear"),
          lastQuarterSeason : review.get("lastQuarterSeason"),
          roomType : review.get("roomType"),
          floorNum : review.get("floor"),
          reviewText : review.get("review"),
          urls : review.get("images"),
          oldUrls : review.get("images"),
          overallRating : review.get("overallRating"),
          locationRating : review.get("locationRating"),
          roomSizeRating : review.get("roomSizeRating"),
          furnitureRating : review.get("furnitureRating"),
          commonAreasRating : review.get("commonAreasRating"),
          cleanlinessRating : review.get("cleanlinessRating"),
          bathroomRating : review.get("bathroomRating"),
          likes : review.get("likes"),
          loaded: true
          });
        });
      });
    });
    
    console.log("rev " + this.state.revId)
    console.log("hall " + this.state.hallName);
  }

  dormChanged(e) { // Updates roomTypes and floors when the dorm is changed, sets alerts if a review from this user for this dorm exists
    if (e.target.value !== "") {
      this.setState({loaded: false}); //we need to reload since the user might reselect old dorm so  we might need to reset some of the fields
      
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

        //makes sure the current review room type and floor num are valid 
        //checks that room type is valid in this dorm
        var rooms = this.state.roomTypes;
        var r;
        var validRoom = false;
        for(r =0; r < rooms.length; r++){
          if(this.state.roomType === rooms[r]){
            validRoom = true;
          }
        }

        if(validRoom === false){ //if the initial roomtype is not valid for this new dorm set roomType to null
          this.setState({invalidRoomType: true});
        }else{
          this.setState({invalidRoomType: false});
        }

        //checks that the floor is not greater than the max floor in this new dorm, if floor isn't valid set floorNum to null
        if(this.state.floorNum > numFloors){
          this.setState({invalidFloor: true});
        }else{
          this.setState({invalidFloor: false});
        }

        this.setState({loaded: true})

      });
    } else this.setState({hallName: e.target.value});

    //checks if user already made a review for new dorm and shows alert except when the old hall is reselected (within the same edit process & review)
    firestore.getReviewIDByDormNameAndUser(e.target.value, firebase.auth().currentUser.email).then((id) => {
      if (id != null && (this.state.oldHallName !== e.target.value)) {
        this.setState({existingReviewId: id});
        this.setState({showExistingReviewAlert: true});
      }else{ 
        this.setState({showExistingReviewAlert: false});
        this.setState({existingReviewId: null});
      }
    });
    
  }

  async addImage(event){

    if(event.target.files[0] !== undefined){
      var duplicateImage = false;
      for(var i=0; i<this.state.image.length; i++) {
        if (event.target.files[0].name === this.state.image[i].name)
          duplicateImage = true;
      } 

      if(!duplicateImage){ //if file name isn't already in image
        if ((this.state.image.length + this.state.urls.length) >= 5) {
          console.log("File limit reached.");
          this.setState({showImageLimitAlert: true});
        }
        else if (event.target.files[0].size > 2000000) {
          console.log("Files cannot exceed 2MB");
          this.setState({showImageSizeAlert: true});
        } else{
          this.setState(({ //add file to "image" so it can get added to urls when review is submitted
            image: [...this.state.image, event.target.files[0]]
          }));
          
          this.setState(({ //add temporary url to images we want to display
            addedImages: [...this.state.addedImages, URL.createObjectURL(event.target.files[0])]
          }));

          this.setState({showImageSizeAlert:false, showImageLimitAlert: false});
          
        }
      }
    }
  }

  //delete image from document/ states/
  deleteImage(imageUrl){
    var urlArray = [...this.state.urls]; 
    var oldUrlArray = [...this.state.oldUrls]; 
    var urlIndex = urlArray.indexOf(imageUrl)

    if (urlIndex !== -1) { //check if image was already in document (urls) and delete from url array, add to urls to delete
      urlArray.splice(urlIndex, 1);
      oldUrlArray.splice(urlIndex,1); //since old urls and urls are a copy of each other, we can delete from the same place
      this.setState({urls: urlArray,
      oldUrls: oldUrlArray,
      urlsToDelete: [...this.state.urlsToDelete, imageUrl]
      });

    }else{ //if image is not yet in the document
      var fileArray = [...this.state.image]; 
      var addedImages = [...this.state.addedImages];
      var imageIndex = addedImages.indexOf(imageUrl);

      if(imageIndex !==-1){ //check if image was added in this edit and delete from image array and from array of images we want to display
        addedImages.splice(imageIndex, 1); //since image and added image are a copy of each other we can delete from the same place
        fileArray.splice(imageIndex, 1);
        this.setState({image:fileArray, addedImages:addedImages});
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

  existingReview(){
    console.log("existing review "+ this.state.existingReviewId);
    console.log("existing review in " + this.state.existingRevDorm);

    this.props.history.push({pathname: "/EditReviewPage/" + this.state.existingReviewId + "/" + this.state.hallName});
    window.location.reload();
  }
  
  render()
  {
    if (this.state.loaded) {

    return (
      <div className={ReviewStyles.mainDivSection}> 

        {this.state.showExistingReviewAlert ? 
    
            <div className={ReviewStyles.mainContainerSection}>

              <div className ={ReviewStyles.titleBlock}>Edit Review:</div>
            
              <div className ={ReviewStyles.middleRow}>

                <div className={ReviewStyles.leftRowSide}>

                  <div className={ReviewStyles.existingReviewDropDown}>

                    <Form className={ReviewStyles.form}>
                      <Form.Group controlId="">
                        <Form.Row>
                          <Form.Label column lg={2}>
                            Hall: 
                          </Form.Label>
                          <Col>
                            <Form.Control 
                              as="select" 
                              name ="dormSelect"
                              defaultValue={this.state.hallName}
                              onChange={e => this.dormChanged(e)}
                            >
                              <option value="">Choose...</option>
                              {this.state.hallNames.map(dorm => (<option key={dorm}>{dorm}</option>))}

                            </Form.Control>
                            {this.state.showExistingReviewAlert && (<Col md={{ span: 20, offset: 0 }}>
                              <Alert variant="success" onClick={()=> {this.existingReview()}}  className={ReviewStyles.successAlert}>
                                Click here to start editing this review!
                              </Alert>
                            </Col>)}
                          </Col>
                        </Form.Row>
                      </Form.Group>
                    </Form>

                  </div>

                </div>

                <div className ={ReviewStyles.rightRowSide}></div>

              </div>

            </div>
 
            :

            <div className={ReviewStyles.mainContainerSection}>
            
              <div className={ReviewStyles.sideSection}></div>

              <div className ={ReviewStyles.titleBlock}>Edit Review:</div>
            
              <div className={ReviewStyles.middleRow}>

                  <div className={ReviewStyles.leftRowSide}>

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
                                name ="dormSelect"
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
                            {this.state.showMoveOutAlert && (<Col md={{ span: 12, offset: 0 }}>
                              <Alert variant="danger" className={ReviewStyles.dangerAlert} dismissible onClose={() => this.setState({ showMoveOutAlert: false })}>
                                Move-in date cannot be later than move-out date
                              </Alert>
                            </Col>)}
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

                      {(this.state.oldUrls.length + this.state.image.length)} / 5 
                      
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

                  {this.state.showImageLimitAlert && (<Col md={{ span: 12, offset: 0 }}>
                            <Alert variant="danger" className={ReviewStyles.imageAlert} dismissible onClose={() => this.setState({ showImageLimitAlert: false })}>
                              You've reached the maximum image limit
                            </Alert>
                  </Col>)}

                  {this.state.showImageSizeAlert && (<Col md={{ span: 12, offset: 0 }}>
                            <Alert variant="danger" className={ReviewStyles.imageAlert} dismissible onClose={() => this.setState({ showImageSizeAlert: false })}>
                              Images cannot be larger than 2 megabytes
                            </Alert>
                  </Col>)}

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
                        || this.state.floorNum === 0 || this.state.reviewText === ""
                        || this.state.showExistingReviewAlert === true || this.state.showMoveOutAlert === true
                        || this.state.invalidRoomType === true || this.state.invalidFloor === true} 
                      onClick={this.updateReview} 
                      size="xxl"
                    >
                      Submit changes
                    </Button>
                    <Row>
                      {this.state.showSuccessAlert && (<Col className={ReviewStyles.submitAlert}>
                        <Alert className={ReviewStyles.successAlert} variant="success" onClick={()=> {this.navigateToPage("/profile")}} dismissible onClose={() => this.setState({ showSuccessAlert: false })}>
                          <Alert.Heading>Review Updated! Click here to view reviews in your profile</Alert.Heading>
                        </Alert>
                      </Col>)}
                    </Row>

                  </div>

                </div>

            </div>
        }

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
