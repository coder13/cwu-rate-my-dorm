import firebase from 'firebase/app';
import React from 'react';
import { Alert } from 'react-bootstrap';
import { UserContext } from '../providers/UserProvider';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified;

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    onSendEmailVerification = () => {
      firebase.auth().currentUser.sendEmailVerification({
        url: `${process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT}/signin?redirect=${document.location.pathname}`
      });
    }
 
    render() {
      return (
        <UserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <div style={{margin: '1em'}}>
                <Alert variant="success">
                  <Alert.Heading>Verifiy your email address</Alert.Heading>
                  Check you E-Mails (Spam folder included) for a confirmation E-Mail
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <p>Didn't Receive an email? <a href='#' onClick={this.onSendEmailVerification}>Resend Email</a></p>
                </Alert>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </UserContext.Consumer>
      );
    }
  }
 
  return WithEmailVerification;
};
 
export default withEmailVerification;