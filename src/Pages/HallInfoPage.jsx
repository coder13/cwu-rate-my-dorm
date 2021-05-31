import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {getDormByName} from '../firestore'
import {Container, Row, Carousel, Card, Button} from 'react-bootstrap'
import LoaderComponent from '../Components/LoaderComponent';
import InfoStyles from '../Styles/HallInfoPage.module.css';

class HallInfoPage extends Component {

  constructor(props)
  {
    super(props);
    this.state = 
    {
      hallName: this.props.location.state.hallName,
      hallDocs: null,
      hallImages: null,
      hallDescription: null,
      loaded: false
    }

    //bind the class functions with this.
    this.generateImages = this.generateImages.bind(this);
    this.amenitiesBlockRender = this.amenitiesBlockRender.bind(this);
    this.roomTypesBlockRender = this.roomTypesBlockRender.bind(this);
  }

  //===navigateToPage===
  //Desc: Handles navigation to next page.
  navigateToPage(toPass) {
    this.props.history.push({pathname: "/", state:{hallName: toPass}});
  }

  //===componentDidMount===
  //Desc: JS for once the render method is mounted.
  componentDidMount()
  {
    getDormByName(this.state.hallName)
      .then((dormNameResult) => {
        this.setState({hallDocs: dormNameResult});
        this.setState({hallImages: dormNameResult.get("images")});
        this.setState({hallDescription: dormNameResult.get("description")});
        this.setState({loaded: true});
      });
  }

  //===generateImages===
  //Desc: Genereates images from database values.
  generateImages(props) 
  {
    const imagesToAdd = props.images;

    const toReturn = imagesToAdd.map((curImage) => 
    
      <Carousel.Item>
        <img
          className={InfoStyles.carouselImageExample}
          src={curImage}
          alt=""
        />
      </Carousel.Item>
    
    );

    return(
      <Carousel className={InfoStyles.imageCarousel}>
        {toReturn}
      </Carousel>
    );
  }

  roomTypesBlockRender(props) {

    const roomTypes = props.roomTypes;

    const toReturn = roomTypes.map((value) =>
      <p className={InfoStyles.exampleElementStyle}>{value}</p>
    );

    return(
      <div className={InfoStyles.roomTypeBlock}>
        <Card bg={'light'} className={InfoStyles.infoCard}>
          <Card.Header><b>Room Types:</b></Card.Header>
          <Card.Body>
            <Card.Text>
              {toReturn}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }

  //===amenitiesBlockRender===
  //Desc: Genereates card for amenities.
  amenitiesBlockRender(props) {

    const amen = props.amen;
    const toReturn = amen.map((value) => 
      <p>{value}</p> 
    );

    return (
      <div className={InfoStyles.amenitiesBlock}>
        <Card bg={'light'} className={InfoStyles.infoCard}>
          <Card.Header><b>Hall Amenities:</b></Card.Header>
          <Card.Body>
            <Card.Text>
              {toReturn}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }

  //===render===
  //Desc: Renders the html.
  render()
  {
    if(this.state.loaded)
    {
      return (
        <Container fluid className={InfoStyles.mainContainer}>

          <Container className={InfoStyles.middleSection}>

            <Row className={InfoStyles.infoAndImageSection}>
              <div className={InfoStyles.imageAndRoomSection}>
                <div className={InfoStyles.topBlock}>
                </div>
                <div className={InfoStyles.imageBlock}>
                <this.generateImages images={this.state.hallImages} />
                </div>
                {/* <div className={InfoStyles.roomTypeBlock}>
                <Card bg={'light'} className={InfoStyles.infoCard}>
                    <Card.Header><b>Room Types:</b></Card.Header>
                    <Card.Body>
                      <Card.Text>
                  {this.state.hallDocs.get("roomTypes")}
                  </Card.Text>
                    </Card.Body>
                  </Card>
                </div> */}
              <this.roomTypesBlockRender roomTypes={this.state.hallDocs.get("roomTypes")} />

              </div>
              <div className={InfoStyles.titleAndDescriptionSection}>
                <div className={InfoStyles.titleBlock}>
                  {this.state.hallName}
                </div>
                <div className={InfoStyles.descriptionBlock}>
                <Card bg={'light'} className={InfoStyles.infoCard}>
                    <Card.Header><b>Hall Information:</b></Card.Header>
                    <Card.Body>
                      <Card.Text>
                        {this.state.hallDescription}
                      </Card.Text>
                    </Card.Body>
                </Card>
                </div>

                <this.amenitiesBlockRender amen ={this.state.hallDocs.get("amenities")} />

              </div>
            </Row>
          </Container>
        </Container>
      )
    }
    else //List is still loading. 
    {
      return(<LoaderComponent />);
    }
    }
    
  }

export default withRouter(HallInfoPage);