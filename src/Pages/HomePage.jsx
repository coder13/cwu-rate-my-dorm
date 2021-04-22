import React, { Component } from "react";
import CWUMap from '../Assets/CWU_Campus_Map.jpg'
import '../Styles/HomePage.css';
import TopBarComponent from '../Components/TopBarComponent'

class HomePage extends Component {

  alerting() {
    var x = this.textContent;
    alert(x);
  }

  //Where your normal JS script goes. This function runs after all the HTML
  //Has mounted.
  componentDidMount() {

    var hallButtons = document.getElementsByClassName('listItem');

    for (var i = 0; i < hallButtons.length; i++) {
      hallButtons[i].addEventListener('click', this.alerting);
    }

  }

  render() {
    return (
      <div>
        <TopBarComponent />
        <div className='mainDivSection'>

          <div className='mainSection'>

            <div className='listSection'>
              <div className='listContainer'>

                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Barto Hall
                                </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Beck Hall
                                    </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Meisner Hall
                                    </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Davies Hall
                                    </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Sparks Hall
                                    </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Hitchcock Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Quigley Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Wilson Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Alford-Monthomery Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Kennedy Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Green Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Carmody-Munro Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Wendell Hill Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    North Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Stephens-Whitney Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Sue Lombard Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Kamola Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Moore Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Dougmore Hall
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Brooklane Village
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Getz-Short Apartments
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Wahle Apartments
                  </div>
                </div>
                <div className='listItemWrapper'>
                  <div className='listItem'>
                    Anderson Apartments
                  </div>
                </div>
                <div className='listItemWrapper' style={{ "margin-bottom": "10px" }}>
                  <div className='listItem'>
                    Student Village
                  </div>
                </div>

              </div>
            </div>

            <div className='mapSection'>

              <div className='mapContainer'>
                <img src={CWUMap} className='mapImage' alt='' />
              </div>

            </div>

          </div>

        </div>

      </div>

    )
  }
}

export default HomePage;