import React, { Component } from "react";
import { Link } from 'react-router-dom';
import TopBarCompStyles from '../Styles/TopBarComponent.module.css';
import CWULogo from '../Assets/CWU_Logo.png'
import { UserContext } from '../providers/UserProvider';
import { auth } from "../firebase";

class TopBarComponent extends Component {
  static contextType = UserContext;

  render() {
    return (
      <div className={TopBarCompStyles.topbar}>
        <div className={TopBarCompStyles.SearchBox}>
          <img className={TopBarCompStyles.CwuLogo} src={CWULogo} alt="logo" />
            
          <form>
              <input className={TopBarCompStyles.searchInput} type="Text" name="search" placeholder="Search Rate My Dorm"/>
          </form>

          <div className={TopBarCompStyles.MenuItemBox}>
              <div className={TopBarCompStyles.MenuItem}>Home</div>
              <div className={TopBarCompStyles.MenuItem}>Other Sections</div>
          </div>

      </div>
    
      <div className={TopBarCompStyles.signInSection}>
          <UserContext.Consumer>
              {(user) => (
                user
                ? (
                  <>
                    <div>{`logged in as ${user.displayName}`}</div>
                    <div className={TopBarCompStyles.LogInSignUpButtons} onClick={() => auth.signOut()}>Sign-out</div>
                    <Link className={TopBarCompStyles.LogInSignUpButtons} to="/account">Account Settings</Link>
                  </>
                )
                : (
                  <>
                    <Link
                      className={TopBarCompStyles.LogInSignUpButtons}
                      to={{
                        pathname: '/signin',
                        state: {
                          from: document.location.pathname
                        }
                      }}
                    >
                      Sign-in
                    </Link>
                    <Link
                      className={TopBarCompStyles.LogInSignUpButtons}
                      to={{
                        pathname: '/signup',
                        state: {
                          from: document.location.pathname
                        }
                      }}
                    >
                      Sign-up
                    </Link>
                  </>
                )
              )}
          </UserContext.Consumer>
          <div className={TopBarCompStyles.LeaveAReviwButton}>Leave a Review</div>
        </div>

      </div>
    )
  }
}

export default TopBarComponent;
