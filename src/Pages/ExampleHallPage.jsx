import React, { Component } from "react";
import '../Styles/ExampleHallPage.css';
import TopBarComponent from '../Components/TopBarComponent'

class ExampleHallPage extends Component {

  constructor()
  {
    super();
    //Set up state and passed props.
  }

  componentDidMount()
  {

  }

  render()
  {

    return(

      <div>

        <TopBarComponent />

        <div className='windowDivSection'>

          <div className='sideSection'>

            <h1>Side Section 1</h1>

          </div>

          <div className='middleSection'>

            <div className='infoAndReviewSection'>
              
              <div className='informationSection'>

                <div className='amenities'>

                  <h1>Amenities</h1>

                </div>

                <div className='imageGallery'>

                  <h1>Image Gallery</h1>

                </div>

              </div>

              <div className='topReviewSection'>

                <h1>Top Review Section</h1>

              </div>

            </div>

            <div className='reviewsSection'>

              <h1>Reviews Section</h1>

            </div>

          </div>

          <div className='sideSection'>

            <h1>Side Section 2</h1>
            
          </div>

        </div>

      </div>
    )

  }

}

export default ExampleHallPage;