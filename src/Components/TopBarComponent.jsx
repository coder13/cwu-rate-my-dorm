import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import Styles from '../Styles/TopBarComponent.module.css';
import CWULogo from '../Assets/CWU_Logo.png'
import { UserContext } from '../providers/UserProvider';
import { auth } from "../firebase";

function SignedInNav() {
  return (
    
    <Nav className="justify-content-end">
      <Dropdown>
        <Dropdown.Toggle variant="flat" id="dropdown-basic" className = {Styles.customBtn}>
          My Account
        </Dropdown.Toggle>
      
        <Dropdown.Menu align="right" className ={Styles.menu}>
          <Dropdown.Item as={Link} to="/profile" className = {Styles.menuItem}>Profile</Dropdown.Item>
          <Dropdown.Item as={Link} to="/account" className = {Styles.menuItem}>Settings</Dropdown.Item>
          <Dropdown.Divider />
              <Dropdown.Item as={Link} onClick={() => auth.signOut()} to="#"className = {Styles.menuItem}>Sign-out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>


    </Nav>
  );
}

function SignedOutNav() {
  return (
    <Nav className="justify-content-end">
      <Nav.Link as={Link}
        to={{
          pathname: '/signin',
          state: {
            from: document.location.pathname
          }
        }}
      >
        <Button 
          variant="flat" className = {Styles.customBtn}
        >
          Sign-in
        </Button>
      </Nav.Link>
      <Nav.Link as={Link}
        to={{
          pathname: '/signup',
          state: {
            from: document.location.pathname
          }
        }}
      >
        <Button 
          variant="flat" className = {Styles.customBtn}
        >
          Sign-up
        </Button>
      </Nav.Link>
    </Nav>
  );
}

function TopBarComponent() {
  const user = useContext(UserContext);

  return (
    <Navbar sticky="top" role="navigation">
      <Navbar.Brand as={Link} to="/">
        <img width={44} height={44} className={Styles.CWULogo} src={CWULogo} alt="Wildcat" />
      </Navbar.Brand>
          
      <Dropdown>
        <Dropdown.Toggle variant="flat" id="dropdown-basic" className = {Styles.customBtn}>
        Search Rate My Dorm
        </Dropdown.Toggle>
      
        <Dropdown.Menu align="right" className ={Styles.menu}>
          <Dropdown.Item as={Link} to="/halls/Alford-Montgomery%20Hall" className = {Styles.menuItem}>Alford-Montgomery</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Anderson%20Apartments" className = {Styles.menuItem}>Anderson</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Barto%20Hall" className = {Styles.menuItem}>Barto</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Beck%20Hall" className = {Styles.menuItem}>Beck</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Brooklane%20Village%20Apartments" className = {Styles.menuItem}>Brooklane Village</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Carmody-Munro%20Hall" className = {Styles.menuItem}>Carmody-Munro</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Davies%20Hall" className = {Styles.menuItem}>Davies</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Dugmore%20Hall" className = {Styles.menuItem}>Dugmore</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Getz-Short%20Apartments" className = {Styles.menuItem}>Getz-Short</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Green%20Hall" className = {Styles.menuItem}>Green</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Hitchcock%20Hall" className = {Styles.menuItem}>Hitchcock</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Kamola%20Hall" className = {Styles.menuItem}>Kamola</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Kennedy%20Hall" className = {Styles.menuItem}>Kennedy</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Meisner%20Hall" className = {Styles.menuItem}>Meisner</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Moore%20Hall" className = {Styles.menuItem}>Moore</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/North%20Hall" className = {Styles.menuItem}>North</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Quigley%20Hall" className = {Styles.menuItem}>Quigley</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Sparks%20Hall" className = {Styles.menuItem}>Sparks</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Stephens-Whitney%20Hall" className = {Styles.menuItem}>Stephens-Whitney</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Student%20Village%20Apartments" className = {Styles.menuItem}>Student Village</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Sue%20Lombard%20Hall" className = {Styles.menuItem}>Sue Lombard</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Wahle%20Apartments" className = {Styles.menuItem}>Wahle</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Wendell%20Hill%20Hall%20A" className = {Styles.menuItem}>Wendell A</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Wendell%20Hill%20Hall%20B" className = {Styles.menuItem}>Wendell B</Dropdown.Item>
          <Dropdown.Item as={Link} to="/halls/Wilson%20Hall" className = {Styles.menuItem}>Wilson</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Nav className="ml-auto mr-auto justify-content-center">
        <Nav.Link as={Link} to="/">
          <Button 
            variant="flat" className = {Styles.customBtn}
          >
            Home
          </Button>
        </Nav.Link>
        <Nav.Link as={Link} to="/MapPage">
          <Button 
            variant="flat" className = {Styles.customBtn}
          >
            Read Reviews
          </Button>
        </Nav.Link>
        <Nav.Link as={Link} to="/ReviewPage">
          <Button 
            variant="flat" className = {Styles.customBtn}
          >
            Write a Review
          </Button>
        </Nav.Link>
      </Nav>

      {user ? <SignedInNav /> : <SignedOutNav />}
    </Navbar>
  );
}

export default TopBarComponent;
