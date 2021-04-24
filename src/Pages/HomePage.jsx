/* Dev: Eli McCoy
 * Date: 4/22/21
 * Desc: Home page component.
 */

import React, { Component } from "react";
//import {auth, firestore} from '../firebase';
import { withRouter } from "react-router-dom";
import CWUMap from '../Assets/CWU_Campus_Map.jpg'
import '../Styles/HomePage.css';
import TopBarComponent from '../Components/TopBarComponent'

class HomePage extends Component {

  constructor(props) {
    super(props);

    //Set up firebase:
    //firestore.settings({ timestampsInSnapshots: true });

    //Set up state:
    this.state = {
      hallToPass: ""
    };

    //Initilize class vars. (Could be loaded by database)
    this.hallNames = ["Barto Hall", "Beck Hall", "Meisner Hall", "Davies Hall",
    "Sparks Hall", "Hitchcock Hall", "Quigley Hall", "Wilson Hall",
    "Alford-Monthomery Hall", "Kennedy Hall", "Green Hall", "Carmody-Munro Hall",
    "Wendell Hill Hall", "North Hall", "Stephens-Whitney Hall", "Sue Lombard Hall",
    "Kamola Hall", "Moore Hall", "Dogmore Hall", "Brooklane Village",
    "Wahle Apartments", "Anderson Apartments", "Student Village"];

    //Bind function to class instance.
    this.navigateToPage = this.navigateToPage.bind(this);
    this.buttonList = this.buttonList.bind(this);
  }

  // //===getDormList===
  // //Desc: Returns a list of dorm names.
  // async getDormList() {
  //   return await firestore.collection('Dorms').get().then((snapshot) => {
  //       snapshot.docs.forEach(doc => {
  //           // name, description, rating, amenities[], images[]
  //           console.log(doc.get('name'))
  //       })
  //   });
  // }

  //===navigateToPage===
  //Desc: Handles navigation to next page.
  navigateToPage(toPass) {
    this.props.history.push({pathname: "/ExampleHallPage", state:{hallName: toPass}});
  }

  //===buttonList===
  //Desc: Component for displaying button list.
  buttonList(props) {
    
    //Store listButtons:
    const hallNames = props.hallNames;
    const listButtonItems = hallNames.map((hallName) =>
      <div className='listItemWrapper'>
        <div className='listItem' key={hallName.toString()} onClick={() =>{this.navigateToPage(hallName.toString())}}>
          <h1>{hallName}</h1>
        </div>
      </div>
    );

    return(
      <div className='listSection'>
        <div id='listContainerScroll' className='listContainer'>{listButtonItems}</div>
      </div>
    );
  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount() {

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

              <this.buttonList hallNames = {this.hallNames}/>

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