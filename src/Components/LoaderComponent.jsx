import React, { Component } from "react";
import LoaderStyles from '../Styles/LoaderComponent.module.css';

class LoaderComponent extends Component 
{
    render() 
    {
       return(
       <div className={LoaderStyles.wrapper}>
           <div className={LoaderStyles.loader}></div>
       </div>)
    }
}

export default LoaderComponent;