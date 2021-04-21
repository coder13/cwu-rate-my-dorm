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
                            <div className = {styles.listContainer}>
                               
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Kamola Hall
                                    </div>
                                </div>
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Hall 2
                                    </div>
                                </div>
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Hall 3
                                    </div>
                                </div>
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Hall 4
                                    </div>
                                </div>
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Hall 5
                                    </div>
                                </div>
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Hall 6
                                    </div>
                                </div>
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Hall 7
                                    </div>
                                </div>
                                <div className = {styles.listItemWrapper}> 
                                    <div className = {styles.listItem}>
                                        Hall 8
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className = {styles.mapSection}>

                            <div className= {styles.mapContainer}>
                                <img src = {CWUMap} className = {styles.mapImage} alt = ''/>
                            </div>

                        </div>


                    </div>
                </div>
            </div>

        )
    }
}

export default HomePage;