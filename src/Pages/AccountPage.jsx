import { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { Alert, Button, Container, Form, Media } from 'react-bootstrap';
import LoaderComponent from '../Components/LoaderComponent';
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";

const AccountPage = () => {
  const user = useContext(UserContext);
  const [error, setError] = useState(null);
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  
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
  const sendResetEmail = event => {
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
      })
      .catch((e) => {
        setError(e);
      });
  };

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
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <Alert.Heading>{error.code}</Alert.Heading>
          <p>{error.message}</p>
        </Alert>
      )}

      {emailHasBeenSent && (
        <Alert variant="success" dismissible onClick={() => setEmailHasBeenSent(false)}>
          An email has been sent to your address!
        </Alert>
      )}
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
      <Button onClick={sendResetEmail}>
        Reset Password
      </Button>
    </Container>
  ) 
};
export default AccountPage;


