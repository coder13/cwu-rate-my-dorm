import React, { Component } from "react";
import { Link } from 'react-router-dom';
import '../Styles/TopBarComponent.css';
import CWULogo from '../Assets/CWU_Logo.png'
import { UserContext } from '../providers/UserProvider';
import { auth } from "../firebase";

class TopBarComponent extends Component {
    static contextType = UserContext;

    render() {
        return (
            <div className="topbar">

                <div className="SearchBox">

                    <img className="CwuLogo" src={CWULogo} alt="logo" />
                    
                    <form>
                        <input className="searchInput" type="Text" name="search" placeholder="Search Rate My Dorm"/>
                    </form>

                    <div className="MenuItemBox">
                        <div className="MenuItem">Home</div>
                        <div className="MenuItem">Other Sections</div>
                    </div>

                </div>
            
                <div className="signInSection">
                    <UserContext.Consumer>
                        {(user) => (
                            user
                            ? (
                                <>
                                    <div>{`logged in as ${user.displayName}`}</div>
                                    <div className="LogInSignUpButtons" onClick={() => auth.signOut()}>Sign-out</div>
                                </>
                            )
                            : (
                                <>
                                    <Link
                                        className="LogInSignUpButtons"
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
                                        className="LogInSignUpButtons"
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
                    <div className="LeaveAReviwButton">Leave a Review</div>
                </div>

            </div>    
        )
    }
}

export default TopBarComponent;