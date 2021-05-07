import { useContext } from "react";
import { Link } from 'react-router-dom';
import { Container, Form, Media } from 'react-bootstrap';
import LoaderComponent from '../Components/LoaderComponent';
import { UserContext } from "../providers/UserProvider";

const AccountPage = () => {
  const user = useContext(UserContext);
  
  if (user === undefined) {
    return (
      <LoaderComponent />
    )
  } else if (user === null) {
    return (
      <Link to="/signin">
        Sign In
      </Link>
    )
  }

  const { photoURL, displayName, email } = user;
  const avatar = photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png';

  return (
    <Container
      style={{
        marginTop: 'calc(2em + 70px)',
        width: '100%',
        minHeight: 'calc(100vh - 70px - 2em)',
      }}
    >
      <h1>Account Settings</h1>
      <Media>
        <img
          width={200}
          height={200}
          className="mr-3"
          src={avatar}
          alt="avatar"
        />
      </Media>
      <hr className="w-100 border" />
      <Form.Group controlId="displayName">
        <Form.Label>Display Name: </Form.Label>
        <Form.Control
          type="text"
          defaultValue={displayName}
        />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email: </Form.Label>
        <Form.Control
          type="text"
          disabled
          defaultValue={email}
        />
      </Form.Group>
      <Link>
        Reset Password
      </Link>
    </Container>
  ) 
};
export default AccountPage;
