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
          
      <Form inline>
        <FormControl type="text" name="search" placeholder="Search Rate My Dorm"/>
      </Form>

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
