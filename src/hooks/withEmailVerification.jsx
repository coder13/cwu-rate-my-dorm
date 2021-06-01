import firebase from 'firebase/app';
import React from 'react';
import { Alert } from 'react-bootstrap';
import { UserContext } from '../providers/UserProvider';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified;

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    state = {
      emailSent: false,
    }

    onSendEmailVerification = async () => {
      if (!firebase.auth().currentUser) {
        console.error(new Error('User is not logged in'));
        return;
      }

      await firebase.auth().currentUser.sendEmailVerification({
        url: `${document.location.origin}/signin?redirect=${document.location.pathname}`
      });

      this.setState({ emailSent: true });
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
                  <p>Didn't Receive an email? <Alert.Link href='#' onClick={this.onSendEmailVerification}>Resend Email</Alert.Link></p>
                  {this.state.emailSent && (
                    <>
                      <hr />
                      <p>Email Sent!</p>
                    </>
                  )}
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