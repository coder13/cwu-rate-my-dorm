import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import Styles from '../Styles/TopBarComponent.module.css';
import CWULogo from '../Assets/CWU_Logo.png'
import { UserContext } from '../providers/UserProvider';
import { auth } from "../firebase";

function SignedInNav() {
  return (
    <Nav className="justify-content-end">
      <Nav.Link as={Link} to="/account">Account Settings</Nav.Link>
      <Nav.Link as={Link} onClick={() => auth.signOut()}>Sign-out</Nav.Link>
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
        Sign-in
      </Nav.Link>
      <Nav.Link as={Link}
        to={{
          pathname: '/signup',
          state: {
            from: document.location.pathname
          }
        }}
      >
        Sign-up
      </Nav.Link>
    </Nav>
  );
}

function TopBarComponent() {
  const user = useContext(UserContext);

  return (
    <Navbar sticky="top" role="navigation">
      <Navbar.Brand as={Link} to="/">
        <img width={44} height={44} className={Styles.CwuLogo} src={CWULogo} alt="Wildcat" />
      </Navbar.Brand>
          
      <Form inline>
        <FormControl type="text" name="search" placeholder="Search Rate My Dorm"/>
      </Form>

      <Nav className="ml-auto mr-auto justify-content-center">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/ReviewPage">Leave A Review</Nav.Link>
      </Nav>

      {user ? <SignedInNav /> : <SignedOutNav />}
    </Navbar>
  );
}

export default TopBarComponent;
