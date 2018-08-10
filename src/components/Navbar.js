import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo-fade.svg';

// Stylesheets
import '../stylesheets/navbar.css'

function Navbar(props) {

  return <div className='navbar navbar-dark bg-dark'>
    <div className='container'>
      <div className='navbar__container'>
        <Link to='/'>
          <div
          className='navBar__group' onClick={() => props.clearSearch()}>
            <img className='navBar__icon' src={logo} alt='code snippets logo'/>
            <h1 className='narbar__title'>
            Code
            <span className='navbar__title__highlight'>Snippets</span>
            </h1>
          </div>
        </Link>
      </div>
    </div>
  </div>
}

export default Navbar
