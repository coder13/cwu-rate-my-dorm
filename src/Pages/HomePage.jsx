/* Dev: Eli McCoy
 * Date: 4/22/21
 * Desc: Home page component.
 */

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import CWUMap from '../Assets/CWU_Campus_Map.jpg'
import '../Styles/HomePage.css';
import TopBarComponent from '../Components/TopBarComponent'

class HomePage extends Component {

  constructor(props) {
    super(props);

    //Set up state:
    this.state = {
      hallToPass: ""
    };

    //Initilize class vars. (Could be loaded by database)
    this.hallNames = ["Barto Hall", "Beck Hall", "Meisner Hall", "Davies Hall",
    "Sparks Hall", "Hitchcock Hall", "Quigley Hall", "Wilson Hall",
    "Alford-Monthomery Hall", "Kennedy Hall", "Green Hall", "Carmody-Munro Hall",
    "Wendell Hill Hall", "North Hall", "Stephens-Whitney Hall", "Sue Lombard Hall",
    "Kamola Hall", "Moore Hall", "Dougmore Hall", "Brooklane Village",
    "Wahle Apartments", "Anderson Apartments", "Student Village"];

    //Bind function to class instance.
    this.navigateToPage = this.navigateToPage.bind(this);
  }

  //===navigateToPage===
  //Desc: Handles navigation to next page.
  navigateToPage() {
    this.props.history.push({pathname: "/ExampleHallPage", state:{ hallName: "Testing!"}});
  }

  //===loadButtons===
  //Desc: Load / creates buttons.
  loadButtons() {

    //Get list section:
    var listContainer = document.getElementById('listContainerScroll');

    //Iterate over halls and creat buttons:
    for(var i = 0; i < this.hallNames.length; i++ ) {
      
      //Create the wrapper:
      var newListWrapper = document.createElement("div");
      newListWrapper.className = "listItemWrapper";

      //Account for last bottom margin:
      if(i === this.hallNames.length - 1)
      {
        newListWrapper.style.marginBottom = "10px";
      }

      //Create new list item:
      var newListItem = document.createElement("div");
      newListItem.className = "listItem";

      //Create text:
      var text = document.createElement("h1");
      text.textContent = this.hallNames[i];

      //Add all elements:
      newListItem.appendChild(text);
      newListWrapper.appendChild(newListItem);
      listContainer.appendChild(newListWrapper);
    }

    //Add even listeners:
    var hallButtons = document.getElementsByClassName('listItem');

    for (var j = 0; j < hallButtons.length; j++) 
    {
      hallButtons[j].addEventListener('click', this.navigateToPage);
    }

  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount() {

    //Load the different hall buttons:
    this.loadButtons();

  }

  //===render===
  //Desc: Renders the html.
  render() {
    return (

      <div>

        <TopBarComponent />

        <div className='mainDivSection'>

          <div className='sideSection'></div>

          <div className='mainSection'>
            
            <div className='listAndMapSection'>
              
              <div className='listSection'>
                
                <div id='listContainerScroll' className='listContainer'></div>

              </div>

              <div className='mapSection'>

                <div className='mapContainer'>

                  {/*Could be loaded from database*/}
                  <img src={CWUMap} className='mapImage' alt =''/>

                </div>

              </div>

            </div>

          </div>

          <div className='sideSection'></div>

        </div>

      </div>

    )
  }
}

export default withRouter(HomePage);