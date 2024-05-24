import './index.css'
import React from 'react'

type propsType = {
  children?: React.ReactNode
}

const NavbarWrapper = (props: propsType) => {
    return (
      <div className="navbarWrapper">
        {props.children}
      </div>
    );
  }
  
  export default NavbarWrapper;