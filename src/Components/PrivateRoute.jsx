import React, { useContext } from 'react';
import { Link, Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { UserContext } from '../providers/UserProvider';

function PrivateRoute({ children, ...rest }) {
  const user = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(location) =>
        !!user ? (
          children
        ) : (
          <div style={{margin: '1em'}}>
            <Alert variant="danger">
              <p>Must be logged in to view page</p>
              Click <Alert.Link as={Link} to={{
                pathname: '/signin',
                state: {
                  from: location.pathname
                }
              }}>here</Alert.Link> to login.
            </Alert>
          </div>
        )
      }
    />
  );
}

export default PrivateRoute;
