import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Icons
import FaSearch from 'react-icons/lib/fa/search'

// Stylesheets
import '../stylesheets/searchBar.css'

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.getArticle = this.getArticle.bind(this)
  }

  getArticle (e) {

    e.preventDefault()
    const searchTerm = e.target.searchValue.value.toLowerCase()
    fetch(`http://157.245.192.198:4000/api/code?tags=${searchTerm}`, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(function (data) {
        return data.json()
      })
      .then(json => {this.props.handleUpdateCodes(json)})
      .then(() => this.props.history.push('/'))
  }

  render() {
  return (<div className='text-center container'>
    <form className='searchForm' onSubmit={this.getArticle}>

      <div className='input-group'>
        <input
          className='searchBox'
          name='searchValue'
          type='text'
          placeholder='Tags...'
          autoComplete="off"
          value={this.props.searchBarValue}
          onChange={this.props.handleInput}
        />
        <button type='submit' value='Search' className='searchButton'>
          <FaSearch className='searchIcon' />
        </button>
      </div>
    </form>
  </div>)
}}

export default SearchBar
