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
        <Dropdown.Toggle variant="flat" id="dropdown-basic" className = {Styles.searchBtn}>
        Search Rate My Dorm
        </Dropdown.Toggle>
        <Dropdown.Menu align="right" className ={Styles.searchMenu}>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Alford-Montgomery%20Hall"}} className = {Styles.sMenuItem}>Alford-Montgomery</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Anderson%20Apartments"}} className = {Styles.sMenuItem}>Anderson</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Barto%20Hall"}} className = {Styles.sMenuItem}>Barto</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Beck%20Hall"}} className = {Styles.sMenuItem}>Beck</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Brooklane%20Village%20Apartments"}} className = {Styles.sMenuItem}>Brooklane Village</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Carmody-Munro%20Hall"}} className = {Styles.sMenuItem}>Carmody-Munro</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Davies%20Hall"}} className = {Styles.sMenuItem}>Davies</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Dugmore%20Hall"}} className = {Styles.sMenuItem}>Dugmore</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Getz-Short%20Apartments"}} className = {Styles.sMenuItem}>Getz-Short</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Green%20Hall"}} className = {Styles.sMenuItem}>Green</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Hitchcock%20Hall"}} className = {Styles.sMenuItem}>Hitchcock</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Kamola%20Hall"}} className = {Styles.sMenuItem}>Kamola</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Kennedy%20Hall"}} className = {Styles.sMenuItem}>Kennedy</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Meisner%20Hall"}} className = {Styles.sMenuItem}>Meisner</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Moore%20Hall"}} className = {Styles.sMenuItem}>Moore</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/North%20Hall"}} className = {Styles.sMenuItem}>North</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Quigley%20Hall"}} className = {Styles.sMenuItem}>Quigley</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Sparks%20Hall"}} className = {Styles.sMenuItem}>Sparks</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Stephens-Whitney%20Hall"}} className = {Styles.sMenuItem}>Stephens-Whitney</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Student%20Village%20Apartments"}} className = {Styles.sMenuItem}>Student Village</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Sue%20Lombard%20Hall"}} className = {Styles.sMenuItem}>Sue Lombard</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Wahle%20Apartments"}} className = {Styles.sMenuItem}>Wahle</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Wendell%20Hill%20Hall%20A"}} className = {Styles.sMenuItem}>Wendell A</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Wendell%20Hill%20Hall%20B"}} className = {Styles.sMenuItem}>Wendell B</Dropdown.Item>
          <Dropdown.Item onClick={() => {window.location.href="/halls/Wilson%20Hall"}} className = {Styles.sMenuItem}>Wilson</Dropdown.Item>
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
