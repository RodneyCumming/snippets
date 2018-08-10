// Libraries
import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

// Components
import Navbar from './Navbar'
import SearchBar from './SearchBar'

// Stylesheets
import 'bootstrap/dist/css/bootstrap.min.css'


// Icons
import FaCode from 'react-icons/lib/fa/code'


class App extends React.Component {
  constructor (props) {
    super(props)
  }


  handleDisplay(code) {
    this.props.history.push(`/display/${code._id}`)
    this.props.currentlySelected(code)
  }

  render () {
    let codes = this.props.codes
    codes = codes.map((value, index) => {
      return (
          <li key={value._id} onClick={() => this.handleDisplay(value)}
          className='card__container mb-2'>
            <FaCode className='card__icon' />
            <div className='card__inner'>
              <p className='card__title'>{value.title}</p>
              {value.tags.map((value, index) => {
                return (
                  <span key={index} className='card__tag'>
                    {value}
                  </span>
                )
              })}
              <p className='card__text'>{value.domain}</p>
            </div>
          </li>
      )
    })

    return (
      <div className='wrapper main'>
        <Navbar clearSearch={this.props.clearSearch}/>
        <SearchBar searchBarValue={this.props.searchBarValue}
                    handleInput={this.props.handleInput}
                    handleUpdateCodes={this.props.handleUpdateCodes}
                    history={this.props.history}
          />
        <ul className='container card__ul'>{codes}</ul>

        <Link to='/add'>
          <p className='addBtn'>+</p>
        </Link>
      </div>
    )
  }
}

export default withRouter(App)
