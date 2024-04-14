import './NavbarWrapper.css'
import React from 'react'

type propsType = {
  children?: React.ReactNode
}

const Navbargest = (props: propsType) => {
    return (
      <div className="navbarWrapper">
        {props.children}
      </div>
    );
  }
  
  export default Navbargest;