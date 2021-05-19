import firebase from 'firebase/app';
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Form, Col} from 'react-bootstrap'
import ReviewStyles from '../Styles/ReviewPage.module.css';
import LoaderComponent from '../Components/LoaderComponent.jsx';
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
      urls: [],
      overallRating: 5,
      locationRating: 5,
      roomSizeRating: 5,
      furnitureRating: 5,
      commonAreasRating: 5,
      cleanlinessRating: 5,
      bathroomRating: 5,
      likes:0
    }
    
    this.submitReview = this.submitReview.bind(this);

  }

 async submitReview() 
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

    //get url array
    var i;
    for(i=0; i<this.state.image.length; i++){
      var imgUrl = await firestore.uploadImage(this.state.hallName, this.state.image[i]); //add to storage and dorm document, returns url
      this.setState(({ //add url to urls
        urls: [...this.state.urls, imgUrl]
      })) 
    }

    //create a new review
    firestore.newReview(this.state.hallName, firebase.auth().currentUser.displayName, firebase.auth().currentUser.uid, firebase.auth().currentUser.email,
    [this.state.firstQuarterYear, this.state.firstQuarterSeason], [this.state.lastQuarterYear, this.state.lastQuarterSeason], this.state.roomType, this.state.floorNum,this.state.reviewText, 
    this.state.urls, this.state.overallRating, this.state.locationRating, this.state.roomSizeRating, this.state.furnitureRating, this.state.commonAreasRating, 
    this.state.cleanlinessRating, this.state.bathroomRating, this.state.likes);
    

    //prompt user that review was submitted:
    alert("Your review has been submitted!");
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

      });
    }
    else this.setState({hallName: e.target.value});
  }
  render()
  {
    if (this.state.loaded) {

    return (
      <div className={ReviewStyles.mainDivSection}> 
        <div className={ReviewStyles.mainContainerSection}>
          
          <div className={ReviewStyles.sideSection}></div>
          
          <div className={ReviewStyles.content}>

            <div className={ReviewStyles.leftContentSide}>
              
              <div className={ReviewStyles.reviewTitleBlock}>
                <h1>Leave a Review:</h1>
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
                          defaultValue="Choose..."
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
                            defaultValue="Choose..."
                            onChange={e => this.setState({firstQuarterSeason: e.target.value})}
                          >
                            <option value="">Choose...</option>
                            <option>Spring</option>
                            <option>Summer</option>
                            <option>Fall</option>
                            <option>Winter</option>

                          </Form.Control>
                          <Form.Control 
                            as="select" 
                            defaultValue="Choose..."
                            onChange={e => this.setState({firstQuarterYear: parseInt(e.target.value)})}
                          >
                            <option  value="0">Choose...</option>
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
                            defaultValue="Choose..."
                            onChange={e => this.setState({lastQuarterSeason: e.target.value})}
                          >
                            <option  value="">Choose...</option>
                            <option>Spring</option>
                            <option>Summer</option>
                            <option>Fall</option>
                            <option>Winter</option>

                          </Form.Control>
                          <Form.Control 
                            as="select" 
                            defaultValue="Choose..."
                            onChange={e => this.setState({lastQuarterYear: parseInt(e.target.value)})}
                          >
                            <option value="0">Choose...</option>
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
                <Form className={ReviewStyles.form}>
                  <Form.Group>
                    <Form.File 
                      id="exampleFormControlFile1" 
                      label="Example file input"
                      onChange={e => 
                        this.setState(prevState =>({
                          image:[...prevState.image, e.target.files[0]]
                        }))
    
                      }
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

              <div className={ReviewStyles.buttonSection}>
                <div 
                  className={ReviewStyles.submitButton}
                  onClick={this.submitReview}
                >
                  <h1>Submit</h1>
                </div>              
              </div>

            </div>

          </div>

          <div className={ReviewStyles.sideSection}></div>

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

export default withRouter(ReviewPage);
