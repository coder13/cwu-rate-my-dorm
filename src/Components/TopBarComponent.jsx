import React, { Component } from "react";
import '../Styles/TopBarComponent.css';
import CWULogo from '../Assets/CWU_Logo.png'
import UserContext from '../providers/UserProvider';

class TopBarComponent extends Component {
    
    render() {
        let { user } = this.context;
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

                    { user
                        ? <div>{`logged in as ${user}`}</div>
                        : <div className="LogInSignUpButtons">Login with Google</div>
                    }
                    <div className="LogInSignUpButtons">Sign-up</div>
                    <div className="LeaveAReviwButton">Leave a Review</div>
                </div>

            </div>    
        )
    }
}

TopBarComponent.contextType = UserContext;

export default TopBarComponent;