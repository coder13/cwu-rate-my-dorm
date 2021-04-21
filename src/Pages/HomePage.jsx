import React, { Component } from "react";
import CWUMap from'../Assets/CWU_Campus_Map.jpg'
import '../Styles/HomePage.css';
import TopBarComponent from '../Components/TopBarComponent'

class HomePage extends Component {
    
    alerting()
    {
        var x = this.textContent;
        alert(x);
    }

    //Where your normal JS script goes. This function runs after all the HTML
    //Has mounted.
    componentDidMount() {

        var hallButtons = document.getElementsByClassName('listItem');

        for(var i = 0; i < hallButtons.length ; i++)
        {
            hallButtons[i].addEventListener('click', this.alerting);
        }

    }
    
    render() {
        return (
            <div>
                <TopBarComponent />
                <div className = 'mainDivSection'>
                    <div className = 'mainSection'>

                        <div className = 'listSection'>
                            <div className = 'listContainer'>
                               
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Kamola Hall
                                    </div>
                                </div>
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Hall 2
                                    </div>
                                </div>
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Hall 3
                                    </div>
                                </div>
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Hall 4
                                    </div>
                                </div>
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Hall 5
                                    </div>
                                </div>
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Hall 6
                                    </div>
                                </div>
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Hall 7
                                    </div>
                                </div>
                                <div className = 'listItemWrapper'> 
                                    <div className = 'listItem'>
                                        Hall 8
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className = 'mapSection'>

                            <div className= 'mapContainer'>
                                <img src = {CWUMap} className = 'mapImage' alt = ''/>
                            </div>

                        </div>


                    </div>
                </div>
            </div>

        )
    }
}

export default HomePage;