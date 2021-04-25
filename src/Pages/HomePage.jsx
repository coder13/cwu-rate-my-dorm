/* Dev: Eli McCoy
 * Date: 4/22/21
 * Desc: Home page component.
 */

import React, { Component } from "react";
import { firestore } from '../firebase';
import { withRouter } from "react-router-dom";
import CWUMap from '../Assets/CWU_Campus_Map.jpg'
import '../Styles/HomePage.css';
import TopBarComponent from '../Components/TopBarComponent'
import LoaderComponent from '../Components/LoaderComponent'

class HomePage extends Component {

  constructor(props) {
    super(props);

    //Set up state:
    this.state = {
      hallNames: [],
      loaded: false
    };

    //Bind function to class instance.
    this.navigateToPage = this.navigateToPage.bind(this);
    this.buttonList = this.buttonList.bind(this);
  }

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

    //Loading names from database.
    const db = firestore;
    db.collection('Dorms').get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        // name, description, rating, amenities[], images[]
        this.setState({ hallNames: [...this.state.hallNames, doc.get('name')] });
      });
    });

    //SetState:
    this.setState({loaded: true});
  }

  //===render===
  //Desc: Renders the html.
  render() {

    //Checks if list is < 1 and if list is loaded.
    if(this.state.loaded && this.state.hallNames.length)
    {
      return (
        <div>
          
          <TopBarComponent />

          <div className='mainDivSection'>

            <div className='sideSection'></div>

              <div className='mainSection'>

                <div className='listAndMapSection'>
  
                  <this.buttonList hallNames={this.state.hallNames} />
  
                  <div className='mapSection'>
  
                    <div className='mapContainer'>
  
                      {/*Could be loaded from database*/}
                      <img src={CWUMap} className='mapImage' alt='' />
  
                    </div>
  
                  </div>
  
                </div>
  
              </div>
  
            <div className='sideSection'></div>
  
          </div>
  
        </div>
      )
    }
    else //List is still loading. 
    {
      return(<LoaderComponent />);
    }
  }
}

export default withRouter(HomePage);