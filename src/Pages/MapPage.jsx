/* Dev: Eli McCoy
 * Date: 4/22/21
 * Desc: Home page component.
 */

import React, { Component } from "react";
import { firestore } from '../firebase';
import { withRouter } from "react-router-dom";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import MapPageStyles from '../Styles/MapPage.module.css';
import LoaderComponent from '../Components/LoaderComponent';
import {Button} from 'react-bootstrap';

class MapPage extends Component {

  constructor(props) {
    super(props);

    //Set up state:
    this.state = {
      hallNames: [],
      loaded: false,
      center: [47.003152, -120.539769]
    };

    this.markers = null;
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
    const hallLocations = [
      [47.004095985910155, -120.53869486380123],// Stephens-Whitney
      [47.00034057034109, -120.54092609509254],//Kamola
      [47.003231074990765, -120.53845450612997],//Wilson
      [47.00337710571372, -120.53519377851852],//Meisner
      [47.00340150777366, -120.53587810320316],//Hitchcock 
      [47.00354430485515, -120.53463264296298],//Davies
      [47.00829929598839, -120.54056252272323],//Wahle Apts.
      [47.00423697523205, -120.5348276552052],//Quigley
      [47.00462428077892, -120.5356719620624],//Barto
      [47.00505182994369, -120.53805472147555],//Moore
      [46.999517110745465, -120.54413889003669],//Gets/Short
      [47.00394518396833, -120.53552200796703],//Sparks
      [47.00868294317813, -120.53411899138466],//Green
      [47.00838985075794, -120.53437044848084],//Kennedy
      [47.007901223093775, -120.53418438219116],//Carmondy-Munro
      [47.00339710016015, -120.53918824721997],//North
      [47.006607892279675, -120.54216529445776],//Dugmore
      [47.007565524066166, -120.534385277893],//Alford-Montgomery
      [47.00021752042942, -120.53992078304556],//Sue Lombard
      [47.01220717917708, -120.52304759574601],//Booklane 
      [47.003587155254564, -120.53655266072745],//Beck
      [47.00828965167414, -120.53331597854493],//Student Village
      [47.00504538570742, -120.53747076502218],//Anderson Apartments
      [47.00657042164514, -120.53416640947272],//Wendell Hill A
      [47.00645503721928, -120.53292556250004]//Wendell Hill B
    ];

    //zip the two arrays together:
    var hallNamesAndLocations = hallNames.map((x, i) => [x, hallLocations[i]]); 

    //Gemerate hall buttons.
    const listButtonItems = hallNamesAndLocations.map((hallInfo) =>
      <Button
        variant="success"
        size="lg"
        className={MapPageStyles.hallButton}
        onMouseOver={() => { this.changeCenterHover(hallInfo[1]) }}
        onClick={() => { this.navigateToPage(hallInfo[0].toString()) }}
      >{hallInfo[0]}
      </Button>
    );

    //Generate markers for buttons.
    this.markers = hallNamesAndLocations.map((hallInfo) =>
      <Marker 
        position={hallInfo[1]}
      >
        <Popup>
          {hallInfo[0]}
        </Popup>
      </Marker>
    );
    
    return(
      <div 
        className={MapPageStyles.listColumn}
        onMouseLeave={this.reCenter}
      >
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
        {this.markers}
      </MapContainer>
    );
  }

  //===changeCenterHover===
  //Desc: Uses map ref to re center on specific halls.
  changeCenterHover(arr)
  {
    this.mapRef.current.setView([arr[0], arr[1]], 25);
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