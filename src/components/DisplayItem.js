// Libraries
import React, { Component } from 'react'
import Highlight from 'react-highlight'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

// Icons
import FaTrash from 'react-icons/lib/fa/trash-o'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaLink from 'react-icons/lib/fa/external-link-square'
import FaDesktop from 'react-icons/lib/fa/desktop'

// Stylesheets
import '../stylesheets/tomorrow.css'
import '../stylesheets/displayForm.css'


class DisplayItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comfirmDelete: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.deleteArticle = this.deleteArticle.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick(e) {
    if (!this.node.contains(e.target)) {
      this.closeComponent()
    }
  }

  closeComponent() {
    this.props.history.push('/')
  }

  toggleComfirmDelete() {
    this.setState(prevState => ({
      comfirmDelete: !prevState.comfirmDelete
    }))
  }

  deleteArticle (id) {
    fetch(`http://node-server.xyz/api/code/${id}`, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      method: 'DELETE'
    }).then(() => this.props.history.push('/'))
    .then(() => this.props.clearSearch())
  }

  render () {
    const { comfirmDelete } = this.state
    let codeArr = []
    // if there is some text to display, create array that separates normal text from code blocks
    if (this.props.currentCode && this.props.currentCode.code && this.props.currentCode.code !== '') {
      codeArr = this.props.currentCode.code.match(
          /<<[\s\S]+?>>|[\s\S]+?(?=<<|$)/g
        )
    }
    // create element from code arr with different styling for code blocks
    const codeParas = codeArr.map((value, index) => {
      if (value.slice(0, 2) === '<<' && value.slice(-2) === '>>') {
        return (
          <Highlight key={index} className='display__code'>
            {value.slice(2, -2)}
          </Highlight>
        )
      } else {
        return (
          <p className='display__text' key={index}>
            {value.trim()}
          </p>
        )
      }
    })

    return (

      <div className='displayContainer'>
        
        <div className='display' ref={node => (this.node = node)}>
          <div className="display__leftPanel">
            <div className="display__iconContainer__delete">
              <FaTrash onClick={() => this.toggleComfirmDelete()} className="display__deleteBtn"/>
              <p className="display__tooltip">Delete</p>
            </div>
            <Link to={`/edit/${this.props.currentCode._id}`}>
              <div className="display__iconContainer">
                <FaPencil className="display__smallIcon"/>
                <FaDesktop className="display__bigBtn"/>
                <p className="display__tooltip">Edit</p>
              </div>
            </Link>
            <a target="_blank" href={`http://${this.props.currentCode.link}`}>
              <div className="display__iconContainer">
                <FaLink className="display__editBtn"/>
                <p className="display__tooltip">Link</p>
              </div>
            </a>
            {comfirmDelete && (
              <div className="displayForm__comfirmDelete">
                <h1 className="displayForm__comfirmDeleteTitle">Delete?</h1>
                <button className="displayForm__comfirmDelete__yes" onClick={() => this.deleteArticle(this.props.currentCode._id)}>Yes</button>
                <button className="displayForm__comfirmDelete__no" onClick={() => this.toggleComfirmDelete()}>No</button>

              </div>
            )}

          </div>
          <div className="display__rightPanel">
            <Link to='/'>
              <p className='display__closeBtn'>x</p>
            </Link>
            <h1 className='display__title'>
              {this.props.currentCode
                ? this.props.currentCode.title
                : 'unknown'}
            </h1>

            <div className='display__inner'>{codeParas}</div>
          </div>

        </div>
      </div>
    )
  }
}

export default withRouter(DisplayItem)
