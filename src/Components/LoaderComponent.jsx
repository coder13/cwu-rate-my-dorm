import React, { Component } from "react";
import LoaderStyles from '../Styles/LoaderComponent.module.css';

class LoaderComponent extends Component 
{
    render() 
    {
       return(
       <div class={LoaderStyles.wrapper}>
           <div class={LoaderStyles.loader}></div>
       </div>)
    }
}

export default LoaderComponent;