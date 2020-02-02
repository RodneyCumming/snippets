// Libraries
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import TextareaAutosize from 'react-autosize-textarea';
import { Link } from 'react-router-dom'

// Icons
import FaTrash from 'react-icons/lib/fa/trash-o'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaLink from 'react-icons/lib/fa/external-link-square'
import FaEye from 'react-icons/lib/fa/eye'
import FaTags from 'react-icons/lib/fa/tags'
import FaDesktop from 'react-icons/lib/fa/desktop'

// Stylesheet
import '../stylesheets/editForm.css'

class EditForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLink: false,
      showTags: false,
      comfirmDelete: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.deleteArticle = this.deleteArticle.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick(e) {
    // if clicked outside of component close
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
      method: 'DELETE'
    }).then(() => this.props.history.push('/'))
    this.props.clearSearch()
  }

  handleEdit (e) {
    e.preventDefault()

    const domainRegex = new RegExp('^(?:https?:)?(?://)?([^/?]+)')
    const allSymbolsRegex = new RegExp('/[&/\\#,+()$~%.\'":*?<>{}!]/', 'g')
    const unnecessaryWords = ['a', 'and', 'the', 'but', 'as']
    const data = {}

    // check if each value is part of form and add to data obj if true
    e.target.title && e.target.title.value
      ? data.title = e.target.title.value
      : data.title = ''
    e.target.link && e.target.link.value
      ? data.link = e.target.link.value
      : data.link = ''
    e.target.tags && e.target.tags.value
      ? data.tags = e.target.tags.value.split(' ')
      : data.tags = []
    e.target.tags && e.target.code.value
      ? data.code = e.target.code.value
      : data.code = ''
    e.target.link && e.target.link.value
      ? data.domain = e.target.link.value.match(domainRegex)[1]
      : data.domain = ''

    data.searchWords = `${data.tags.join(' ')} ${data.title}`
      .toLowerCase()
      .replace(allSymbolsRegex, '')
      .split(' ')
      .filter(value => !unnecessaryWords.includes(value) )

    this.putRequest(data)
  }

  putRequest(data) {
    fetch(`http://node-server.xyz/api/code/${this.props.currentCode._id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(data)
    }).then(() => this.props.history.push('/'))
    .then(() => this.props.clearSearch())
  }

  toggleLink() {
    this.setState(prevState => ({
      showLink: !prevState.showLink
    }))
  }

  toggleTags() {
    this.setState(prevState => ({
      showTags: !prevState.showTags
    }))
  }

  render () {
    const { comfirmDelete, showLink, showTags } = this.state
    return (
      <div className='editForm__container'>
        <div className='editForm' ref={node => (this.node = node)}>
          <div className='editForm__leftPanel'>
            <div className="editForm__iconContainer__delete">
              <FaTrash onClick={() => this.toggleComfirmDelete()} className="editForm__deleteBtn"/>
              <p className="editForm__tooltip">Delete</p>
            </div>
            <Link to={`/display/${this.props.currentCode._id}`}>

              <div className="editForm__iconContainer">
                <FaEye className="editForm__smallIcon"/>
                <FaDesktop className="editForm__bigBtn"/>
                <p className="editForm__tooltip">View</p>
              </div>
            </Link>

            <div className="editForm__iconContainer" onClick={() => this.toggleLink()}>
              <FaPencil className="editForm__smallIcon"/>
              <FaLink className="editForm__bigBtn"/>
              <p className="editForm__tooltip">Edit Link</p>
            </div>
            <div className="editForm__iconContainer" onClick={() => this.toggleTags()}>
              <FaPencil className="editForm__smallIcon"/>
              <FaTags className="editForm__editBtn"/>
              <p className="editForm__tooltip">Edit Tags</p>
            </div>
            {comfirmDelete && (
              <div className="editForm__comfirmDelete">
                <h1 className="editForm__comfirmDeleteTitle">Delete?</h1>
                <button className="editForm__comfirmDelete__yes" onClick={() => this.deleteArticle(this.props.currentCode._id)}>Yes</button>
                <button className="editForm__comfirmDelete__no" onClick={() => this.toggleComfirmDelete()}>No</button>
              </div>
            )}


          </div>
          <div className='editForm__rightPanel'>
            <p className='editForm__closeBtn' onClick={() => this.closeComponent()}>
              x
            </p>
            <form onSubmit={this.handleEdit}>
              <input type='text' name='title' className='editForm__header' placeholder="Title" defaultValue={this.props.currentCode.title} autoComplete="off"/>
              <div className='editForm__btnContainer'>
                {showLink && (
                  <input type='text' name='link' placeholder="Link..." className='form-control' defaultValue={this.props.currentCode.link} autoComplete="off"/>
                )}
              </div>
              <div className='editForm__btnContainer'>
                {showTags && (
                  <input type='text' name='tags' placeholder="Tags..." className='form-control' defaultValue={this.props.currentCode.tags.join(' ')} autoComplete="off"/>
                )}
              </div>
              <div className='form-group'>
                <TextareaAutosize type='text' name='code' className='editForm__codeInput' placeholder="Code..." defaultValue={this.props.currentCode.code} autoComplete="off"/>
              </div>
              <div className='editForm__btnContainer'>
                <button className='btn editForm__btn float-right' >Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    )
  }
}

export default withRouter(EditForm)
