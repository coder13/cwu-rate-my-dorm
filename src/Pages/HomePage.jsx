import React, { Component } from "react";
import CWUMap from'../Assets/CWU_Campus_Map.jpg'
import styles from '../Styles/HomePage.module.css';
import mainStyles from '../Styles/MainTheme.module.css';
import TopBarComponent from '../Components/TopBarComponent'

class HomePage extends Component {
    render() {
        return (
            
            <div>
                <TopBarComponent />
                <div className = {mainStyles.mainDivSection}>
                    <div className = {styles.mainSection}>

                        <div className = {styles.listSection}>
                            <h1>List Section</h1>
                        </div>

                        <div className = {styles.mapSection}>
                            <img className = {styles.mapImage} src = {CWUMap} alt = ''/>
                        </div>


                    </div>
                </div>
            </div>

        )
    }
}

export default HomePage;