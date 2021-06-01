import firebase from 'firebase/app';
import React, { Component} from "react";
import { withRouter } from "react-router-dom";
import {Form, Col, Button} from 'react-bootstrap'
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
      oldHallName: this.props.location.state.hallName, //this is the initial hall name that gets passed in
      firstQuarterYear: this.props.location.state.firstQuarterYear,
      firstQuarterSeason: this.props.location.state.firstQuarterSeason,
      lastQuarterYear: this.props.location.state.lastQuarterYear,
      lastQuarterSeason: this.props.location.state.lastQuarterSeason,
      roomType: this.props.location.state.roomType,
      roomTypes: this.props.location.state.roomTypes,
      floorNum: this.props.location.state.floorNum,
      floors: this.props.location.state.floors,
      reviewText: this.props.location.state.reviewText,
      image: [], //files selected only, no url
      urls: this.props.location.state.urls, 
      overallRating: this.props.location.state.overallRating, //this will be the most p to date overall rating, this might get updated
      oldOverallRating: this.props.location.state.overallRating, //this will be the old overall rating, this does not get updated
      locationRating: this.props.location.state.locationRating,
      roomSizeRating: this.props.location.state.roomSizeRating,
      furnitureRating: this.props.location.state.furnitureRating,
      commonAreasRating: this.props.location.state.commonAreasRating,
      cleanlinessRating: this.props.location.state.cleanlinessRating,
      bathroomRating: this.props.location.state.bathroomRating,
      likes:this.props.location.state.likes,
      curUserImage: null,
    }
    
    this.updateReview = this.updateReview.bind(this);
  }

 async updateReview() 
  {

    //Alert Example:
    alert("Hall Name: " + this.state.hallName + "\n" +
          "First Quarter: " + this.state.firstQuarterSeason + " " + this.state.firstQuarterYear + "\n" +
          "Last Quarter: " + this.state.lastQuarterSeason + " " + this.state.lastQuarterYear + "\n" +
          "Room Type: " + this.state.roomType + "\n" +
          "Floor Num: " + this.state.floorNum + "\n" +
          "Review Text: " + this.state.reviewText + "\n" +
          "Image: " + this.state.image + "\n" +
          "Overall Rating: " + this.state.overallRating + "\n" +
          "Location Rating: " + this.state.locationRating + "\n" +
          "Room Size Rating: " + this.state.roomSizeRating + "\n" +
          "Furniture Rating: " + this.state.furnitureRating + "\n" +
          "Common Area Rating: " + this.state.commonAreasRating + "\n" +
          "Cleanliness Rating: " + this.state.cleanlinessRating + "\n" +
          "Bathroom Rating: " + this.state.bathroomRating + "\n" +
          "Author: " + firebase.auth().currentUser.displayName + "\n" +
          "Email: " + firebase.auth().currentUser.email + "\n")

    //Add review to firebase:
    
    if(this.state.hallName !== this.state.oldHallName){ //if the hall changed, then we want to delete review and create new one in the collection of the new hall
      firestore.newReview(this.state.hallName, firebase.auth().currentUser.displayName, firebase.auth().currentUser.uid,  //creates a new review and in the process update the overall rating
      firebase.auth().currentUser.email,[this.state.firstQuarterYear, this.state.firstQuarterSeason], 
      [this.state.lastQuarterYear, this.state.lastQuarterSeason], this.state.roomType, this.state.floorNum,
      this.state.reviewText,this.state.urls, this.state.overallRating, this.state.locationRating, this.state.roomSizeRating,
      this.state.furnitureRating, this.state.commonAreasRating,this.state.cleanlinessRating, this.state.bathroomRating, 
      this.state.likes);

      firestore.deleteReview(this.state.oldHallName, this.state.revId, this.state.oldOverallRating); //will delete review and in the process update overall rating
    
    }else{
      firestore.editReview (this.state.revId, this.state.hallName, [this.state.firstQuarterYear, this.state.firstQuarterSeason], 
      [this.state.lastQuarterYear, this.state.lastQuarterSeason], this.state.roomType, this.state.floorNum, this.state.reviewText, 
      this.state.urls, this.state.overallRating, this.state.locationRating, this.state.roomSizeRating, this.state.furnitureRating, 
      this.state.commonAreasRating, this.state.cleanlinessRating, this.state.bathroomRating, this.state.likes, this.state.oldOverallRating);
    }
  
    //prompt user that review was updated:
    alert("Your review has been updated!");

    this.navigateToPage("/MapPage"); //go back to page
  }

  navigateToPage(Page) {
    this.props.history.push({pathname: Page});
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user == null)
        this.navigateToPage("signin");
    });


    this.setState(firestore.getDormNames().then((names) => {
      this.setState({ hallNames: names });
      this.setState({ loaded: true });
    }));

    //console.log(auth.currentUser);
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
    if(event.target.files[0] !== undefined){
      var imgUrl = await firestore.uploadImage(event.target.files[0]); //add to storage and dorm document, returns url
      this.setState(({ //add url to urls
        urls: [...this.state.urls, imgUrl]
      }))   
    }
  }

  deleteImage(imageUrl){
    alert("This image will be deleted");
    var urlArray = [...this.state.urls]; 
    var urlIndex = urlArray.indexOf(imageUrl)
    if (urlIndex !== -1) { //check if image was already in document and delete from url array
      urlArray.splice(urlIndex, 1);
      this.setState({urls: urlArray});
      firestore.deleteImage(imageUrl);//delete image from storage
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

          <div className={ReviewStyles.mainContent}>

    

            <div className={ReviewStyles.content}>

              <div className={ReviewStyles.leftContentSide}>
                
                <div className={ReviewStyles.reviewTitleBlock}>
                  <h1>Edit Review:</h1>
                </div>

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
                    margin-bottom: 45px;
                  }
                  .btn-submit:hover{
                    color: white;
                    background-color: #820d28;
                  }
                  .btn-xxl {
                    padding: 1rem 1.5rem;
                    font-size: 2.3rem;
                  }
                  `}
                </style>

                </div>

                {/*
                
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
                </div>
                */}
              </div>

            </div>
                

            <div className = {ReviewStyles.bottomSection}>
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
                </div>

                
                <div className = {ReviewStyles.imagesRow}>
                  
                  {this.state.urls.map(url => this.renderImage(url))}


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
                </div>

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

export default withRouter(EditReviewPage);
