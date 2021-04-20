import React, { Component } from "react";
import '../Styles/LoaderComponent.css';

class LoaderComponent extends Component 
{
    render() 
    {
       return(
       <div class="wrapper">
           <div class="loader"></div>
       </div>)
    }
}

export default LoaderComponent;