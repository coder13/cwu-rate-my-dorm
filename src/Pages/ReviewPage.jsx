import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Form} from 'react-bootstrap'
import ReviewStyles from '../Styles/ReviewPage.module.css';

class ReviewPage extends Component {

  constructor(props)
  {
    super(props);

    this.dropDownForm = this.dropDownForm.bind(this);
    this.reviewTextForm = this.reviewTextForm.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
  }

  submitReview() 
  {

  }

  componentDidMount()
  {

  }

  dropDownForm() {
    return (
      <Form className={ReviewStyles.dropDownForm}>
        
        <div className={ReviewStyles.formItem}>
          <div className={ReviewStyles.label}>
            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
              Drom/Apt. Hall
            </Form.Label>
          </div>
          <div  className={ReviewStyles.dropDown}>
            <Form.Control
              as="select"
              className="my-1 mr-sm-2"
              id="DormHallID"
              custom
            >
              <option value="0">Choose...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Control>
          </div>
        </div>

        <div className={ReviewStyles.formItem}>
          <div className={ReviewStyles.label}>
            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
              First Quarter
            </Form.Label>
          </div>
          <div  className={ReviewStyles.dropDown}>
            <Form.Control type="text" placeholder="Ex. Fall 2019" />
          </div>
        </div>

        <div className={ReviewStyles.formItem}>
          <div className={ReviewStyles.label}>
            <Form.Label className="my-1 mr-2">
              Last Quarter
            </Form.Label>
          </div>
          <div  className={ReviewStyles.dropDown}>
            <Form.Control type="text" placeholder="Ex. Spring 2020" />
          </div>
        </div>

        <div className={ReviewStyles.formItem}>
          <div className={ReviewStyles.label}>
            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
              Room Type
            </Form.Label>
          </div>
          <div className={ReviewStyles.dropDown}>
            <Form.Control
              as="select"
              className="my-1 mr-sm-2"
              id="roomTypeID"
            >
              <option value="0">Choose...</option>
              <option value="1">Single Room</option>
              <option value="2">Double Room</option>
              <option value="3">Triple Room</option>
              <option value="4">Single Suite</option>
              <option value="5">Double Suite</option>
            </Form.Control>
          </div>
        </div>

        <div className={ReviewStyles.formItem}>
          <div className={ReviewStyles.label}>
            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
              Floor
            </Form.Label>
          </div>
          <div  className={ReviewStyles.dropDown}>
            <Form.Control
              as="select"
              className="my-1 mr-sm-2"
              id="floorNumID"
              custom
            >
              <option value="0">Choose...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="3">Four</option>
            </Form.Control>
          </div>
        </div>

      </Form>
    );
  }

  reviewTextForm()
  {
    return (
      <Form className={ReviewStyles.dropDownForm}>
        <Form.Label className={ReviewStyles.label}>Review:</Form.Label>
        <Form.Control as="textarea" rows={6} />
      </Form>
    );
 
  }

  imageUpload()
  {
    return(
      <Form className={ReviewStyles.dropDownForm}>
        <Form.File id="exampleFormControlFile1" label="Upload Image" className={ReviewStyles.label}/>
      </Form>
    );
  }


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
                <this.dropDownForm/>
              </div>

              <div className={ReviewStyles.reviewText}>
                <this.reviewTextForm/>
              </div>

              <div className={ReviewStyles.reviewImages}>
                <this.imageUpload/>
              </div>

            </div>

            <div className={ReviewStyles.rightContentSide}>
              <div className={ReviewStyles.sliderSection}>

                <div className={ReviewStyles.sliderBox}>
                  <p>slider box</p>
                </div>

              </div>

              <div className={ReviewStyles.buttonSection}>
                <div className={ReviewStyles.submitButton}>
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