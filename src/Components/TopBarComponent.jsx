import React, { Component } from "react";
import '../Styles/TopBarComponent.css';
import CWULogo from'../Assets/CWU_Logo.png'

class TopBarComponent extends Component {
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
                <div className="LogInSignUpButtons">Login</div>
                <div className="LogInSignUpButtons">Sign-up</div>
                <div className="LeaveAReviwButton">Leave a Review</div>
            </div>

        </div>
        
        )
    }
}

export default TopBarComponent;