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
              <div className={InfoStyles.ImageAndAmenititesSection}>
                <div className={InfoStyles.topBlock}>
                </div>
                <div className={InfoStyles.imageBlock}>
                <this.generateImages images={this.state.hallImages} />
                </div>
                <div className={InfoStyles.roomTypeBlock}>
                  {"room types"}
                </div>
              </div>
              <div className={InfoStyles.titleAndDescriptionSection}>
                <div className={InfoStyles.titleBlock}>
                  {"Hall Name"}
                </div>
                <div className={InfoStyles.descriptionBlock}>
                <Card bg={'light'} className={InfoStyles.infoCard}>
                    <Card.Header><b>Hall Information:</b></Card.Header>
                    <Card.Body>
                      <Card.Text>
                        {this.state.hallDescription}
                        <br />
                        <Button variant="primary">More Info</Button>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className={InfoStyles.amenitiesBlock}>
                  {"amenities"}
                </div>
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