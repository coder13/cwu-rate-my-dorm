/* Dev: Eli McCoy
 * Date: 4/22/21
 * Desc: Map page component.
 */

import React, {Component} from "react";
import {firestore} from '../firebase';
import {withRouter} from "react-router-dom";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import MapPageStyles from '../Styles/MapPage.module.css';
import LoaderComponent from '../Components/LoaderComponent';
import {Button, Form} from 'react-bootstrap';

class MapPage extends Component {

  constructor(props) {
    super(props);

    //Set up state:
    this.state = {
      hallKVPair: [],
      hallsToDisplay: [],
      loaded: false,
      center: [47.003152, -120.539769]
    };

    this.markers = null;
    this.mapRef = React.createRef();

    //Bind function to class instance.
    this.navigateToPage = this.navigateToPage.bind(this);
    this.buttonList = this.buttonList.bind(this);
    this.hallOptions = this.hallOptions.bind(this);
    this.mapChangeOptions = this.mapChangeOptions.bind(this);
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
    const hallKV = props.hallKVPair;

    //Gemerate hall buttons.
    const listButtonItems = hallKV.map((hallInfo) =>
      <Button
        variant="success"
        size="lg"
        className={MapPageStyles.hallButton}
        onMouseOver={() => { this.changeCenterHover(hallInfo.value) }}
        onClick={() => { this.navigateToPage(hallInfo.key.toString()) }}
      >{hallInfo.key}
      </Button>
    );

    //Generate markers for buttons.
    this.markers = hallKV.map((hallInfo) =>
      <Marker 
        position={hallInfo.value}
      >
        <Popup>
          {hallInfo.key}
        </Popup>
      </Marker>
    );
    
    return(
      <div className={MapPageStyles.listColumn} onMouseLeave={this.reCenter}>

        <div className={MapPageStyles.optionsBlock}>
          <this.hallOptions/>
        </div>

        <div className={MapPageStyles.buttonListBlock}>
          {listButtonItems}
        </div>

      </div>
    );
  }

  //===hallOptions===
  //Desc: Get hall option inputs.
  hallOptions() {

    return (
     <Form>
        <Form.Group>
          <h5>Filter:</h5>
          <Form.Control as="select" defaultValue="Choose..." onChange={(e)=>{this.mapChangeOptions(e.target.value)}}>
            <option>Choose</option>
            <option>Alphabetical</option>
            <option>Residents Halls</option>
            <option>Apartments</option>
            <option>Bassettis</option>
            <option>Central</option>
            <option>North</option>
            <option>South</option>
          </Form.Control>
          <Button variant="primary" onClick={()=>{this.mapChangeOptions("Reset")}} className={MapPageStyles.resetButton}>
            Reset
          </Button>
        </Form.Group>
      </Form>
    );

  }

  //===mapChangeOptions===
  //Desc: function to chnage the map with the filers.
  mapChangeOptions(option) {
    
    if(option == "Alphabetical")
    {
      var alphabetical = this.state.hallKVPair
        .sort((a, b) => {
          var nameA=a.key.toLowerCase(), nameB=b.key.toLowerCase();
          if (nameA < nameB) //sort string ascending
          {
            return -1; 
          }
          if (nameA > nameB)
          {
            return 1;
          }
          return 0; //default return value (no sorting)
        }
      );
      this.setState({hallsToDisplay: alphabetical});
      
    }
    else if(option == "Residents Halls")
    {
      var resHalls = this.state.hallKVPair
        .filter(item => (item.key !== "Wahle Apartments" 
                      && item.key !== "Getz-Short Apartments"
                      && item.key !== "Student Village Apartments"
                      && item.key !== "Brooklane Village Apartments"
                      && item.key !== "Anderson Apartments")
      );
      this.setState({hallsToDisplay: resHalls});
    }
    else if(option == "Apartments")
    {
      var apartments =this.state.hallKVPair
      .filter(item => (item.key === "Wahle Apartments" 
                    || item.key === "Getz-Short Apartments"
                    || item.key === "Student Village Apartments"
                    || item.key === "Brooklane Village Apartments"
                    || item.key === "Anderson Apartments")
      );
      this.setState({hallsToDisplay: apartments});
    }
    else if(option == "Bassettis")
    {
      var bassettis =this.state.hallKVPair
      .filter(item => (item.key === "Meisner Hall" 
                    || item.key === "Sparks Hall"
                    || item.key === "Quigley Hall"
                    || item.key === "Beck Hall"
                    || item.key === "Davies Hall"
                    || item.key === "Hitchcock Hall"
                    || item.key === "Barto Hall")
      );
      this.setState({hallsToDisplay: bassettis});
    }
    else if(option == "Central")
    {
      var central =this.state.hallKVPair
      .filter(item => (item.key === "Wilson Hall" 
                    || item.key === "Moore Hall"
                    || item.key === "Stephens-Whitney Hall"
                    || item.key === "North Hall")
      );
      this.setState({hallsToDisplay: central});
    }
    else if(option == "North")
    {
      var north =this.state.hallKVPair
      .filter(item => (item.key === "Alford-Montgomery Hall" 
                    || item.key === "Kennedy Hall"
                    || item.key === "Carmody-Munro Hall"
                    || item.key === "Green Hall"
                    || item.key === "Wendell Hill Hall A"
                    || item.key === "Wendell Hill Hall B"
                    || item.key === "Dugmore Hall")
      );
      this.setState({hallsToDisplay: north});
    }
    else if(option == "South")
    {
      var south =this.state.hallKVPair
      .filter(item => (item.key === "Kamola Hall" 
                    || item.key === "Sue Lombard Hall")
      );
      this.setState({hallsToDisplay: south});
    }
    else if(option == "Reset")
    {
      this.setState({hallsToDisplay: this.state.hallKVPair});
    }
    
  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount() {

    //Loading names from database.
    const db = firestore;
    db.collection('Dorms').get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        // name, description, rating, amenities[], images[]
        let kvPair = {key: doc.get('name'), value: doc.get('coordinates')}; //Get names and cords as kv pairs.
        this.setState({ hallKVPair: [...this.state.hallKVPair, kvPair]});
      });
    }).then(()=>{
      this.setState({hallsToDisplay: this.state.hallKVPair});
      console.log(this.state.hallsToDisplay);
      this.setState({loaded: true}); //Set loaded to true.
    });
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
    if (this.mapRef.current) {
      this.mapRef.current.setView([arr[0], arr[1]], 25);
    }
  }

  //===reCenter===
  //Desc: Re centers the map to original position.
  reCenter() 
  {
    if (this.mapRef.current) {
      this.mapRef.current.setView(this.state.center, 16);
    }
  }

  //===render===
  //Desc: Renders the html.
  render() {

    //Checks if list is loaded.
    if(this.state.loaded)
    {
      return (
        <div className={MapPageStyles.mainContent}>

          <this.buttonList hallKVPair={this.state.hallsToDisplay}/>

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
