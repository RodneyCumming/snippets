import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// stylesheets
import '../stylesheets/app.css'

// Components
import App from './App'
import EditForm from './EditForm'
import AddForm from './AddForm'
import DisplayItem from './DisplayItem'


export default class Root extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentCode: {},
      codes: [],
      searchBarValue: '',
    }
    this.currentlySelected = this.currentlySelected.bind(this)
    this.handleUpdateCodes = this.handleUpdateCodes.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  currentlySelected(code) {
    this.setState({ currentCode: code })
  }

  handleUpdateCodes(input) {
    this.setState({ codes: input })
  }

  clearSearch() {
    this.setState({
      codes: [],
      searchBarValue: ''
    })
  }

  handleInput(event) {
    const inputValue = event.target.value
    this.setState(prevState => ({
      searchBarValue: inputValue
    }))
  }

  render () {
    const { currentCode, codes, searchBarValue } = this.state
    return (
      <Router>
        <div>
          <Route path='/' render={props =>
            <App
             codes={codes}
             history={this.props.history}
             currentlySelected={this.currentlySelected}
             handleUpdateCodes={this.handleUpdateCodes}
             clearSearch={this.clearSearch}
             handleInput={this.handleInput}
             searchBarValue={searchBarValue}
            />} />
          <Route path='/add' render={props =>
             <AddForm
               history={this.props.history}
               clearSearch={this.clearSearch}
             />}/>
          <Route path='/display' render={props =>
            <DisplayItem
              currentCode={currentCode}
              history={this.props.history}
              clearSearch={this.clearSearch}
            />}/>
          <Route path='/edit/:id' render={props =>
            <EditForm
              currentCode={currentCode}
              history={this.props.history}
              clearSearch={this.clearSearch}
            />}/>
        </div>
      </Router>
    )
  }
}
