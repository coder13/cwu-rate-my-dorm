/* Dev: Eli McCoy
 * Date: 4/22/21
 * Desc: Home page component.
 */

import React, { Component } from "react";
import { firestore } from '../firebase';
import { withRouter } from "react-router-dom";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import MapPageStyles from '../Styles/MapPage.module.css';
import LoaderComponent from '../Components/LoaderComponent'

class MapPage extends Component {

  constructor(props) {
    super(props);

    //Set up state:
    this.state = {
      hallNames: [],
      loaded: false,
      center: [47.003152, -120.539769]
    };

    this.mapRef = React.createRef();

    //Bind function to class instance.
    this.navigateToPage = this.navigateToPage.bind(this);
    this.buttonList = this.buttonList.bind(this);
    this.mapComponent= this.mapComponent.bind(this);
    this.changeCenterHover= this.changeCenterHover.bind(this);
    this.reCenter = this.reCenter.bind(this);
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
      <div
        className={MapPageStyles.hallButton}
        onMouseOver={() => { this.changeCenterHover(47.00035836920583, -120.54091814980733) }}
        onMouseLeave={this.reCenter}
        onClick={() => { this.navigateToPage(hallName.toString()) }}
      >{hallName}</div>
    );

    return(
      <div className={MapPageStyles.listColumn}>
        {listButtonItems}
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

  //===mapComponent===
  //Desc: Creates and initilizes the map.
  mapComponent() 
  {
    return(
      <MapContainer
        className={MapPageStyles.leafletMap}
        center={this.state.center}
        zoom={16}
        scrollWheelZoom={true}
        whenCreated={ mapInstance => { this.mapRef.current = mapInstance}}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[47.00035836920583, -120.54091814980733]}>
          <Popup>
            Kamola Hall
          </Popup>
        </Marker>
      </MapContainer>
    );
  }

  //===changeCenterHover===
  //Desc: Uses map ref to re center on specific halls.
  changeCenterHover(long, lat)
  {
    this.mapRef.current.setView([long, lat], 20);
  }

  //===reCenter===
  //Desc: Re centers the map to original position.
  reCenter() 
  {
    this.mapRef.current.setView(this.state.center, 16);
  }

  //===render===
  //Desc: Renders the html.
  render() {

    //Checks if list is < 1 and if list is loaded.
    if(this.state.loaded && this.state.hallNames.length)
    {
      return (
        <div className={MapPageStyles.mainContent}>

          <this.buttonList hallNames={this.state.hallNames}/>

          <this.mapComponent/>

        </div>
      )
    }
    else //List is still loading. 
    {
      return(<LoaderComponent />);
    }
  }
}

export default withRouter(MapPage);