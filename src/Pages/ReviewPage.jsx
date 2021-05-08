import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Form, Col} from 'react-bootstrap'
import ReviewStyles from '../Styles/ReviewPage.module.css';

class ReviewPage extends Component {

  constructor(props)
  {
    super(props);

    //Set the states:
    this.state = {
      hallName: "Default",
      firstQuarter: "Default",
      lastQuarter: "Defualt",
      roomType: "Default",
      floorNum: "Default",
      reviewText:"Default",
      image: null,
      overallRating: 50,
      locationRating: 50,
      roomSizeRating: 50,
      furnitureRating: 50,
      commonAreasRating: 50,
      cleanlinessRating: 50,
      bathroomRating: 50
    }

    this.submitReview = this.submitReview.bind(this);

  }

  submitReview() 
  {

    //Alert Example:
    alert("Hall Name: " + this.state.hallName + "\n" +
          "First Quarter: " + this.state.firstQuarter + "\n" +
          "Last Quarter: " + this.state.lastQuarter + "\n" +
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
          "Bathroom Rating: " + this.state.bathroomRating + "\n");
    //Add review to firebase:
    

    //prompt user that review was submitted:
    alert("Your review has been submitted!");
  }

  componentDidMount()
  {}

  render()
  {
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
                          onChange={e => this.setState({hallName: e.target.value})}  
                        >
                          <option>Choose...</option>
                          <option>Kamola Hall</option>
                          <option>Sparks Hall</option>
                          <option>Beck Hall</option>
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
                          onChange={e => this.setState({firstQuarter: e.target.value})}
                        >
                          <option>Choose...</option>
                          <option>Test 1</option>
                          <option>Test 2</option>
                          <option>Test 3</option>
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
                          onChange={e => this.setState({lastQuarter: e.target.value})}
                        >
                          <option>Choose...</option>
                          <option>Test 1</option>
                          <option>Test 2</option>
                          <option>Test 3</option>
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
                          onChange={e => this.setState({roomType: e.target.value})}
                        >
                          <option>Choose...</option>
                          <option>Single Room</option>
                          <option>Double Room</option>
                          <option>Triple Room</option>
                          <option>Single Suite</option>
                          <option>Double Suite</option>
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
                          onChange={e => this.setState({floorNum: e.target.value})}
                        >
                          <option>Choose...</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
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
                      onChange={e => this.setState({image: e.target.value})}
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

}

export default withRouter(ReviewPage);