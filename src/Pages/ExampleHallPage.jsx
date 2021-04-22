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
                Info Section
              </div>

              <div className='reviewSection'>
                Review Section
              </div>

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