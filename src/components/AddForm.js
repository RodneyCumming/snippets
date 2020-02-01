// Libraries
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

// data
import keywords from '../data/keywords'

// icons
import IoFlash from 'react-icons/lib/io/flash'
import FaPlus from 'react-icons/lib/fa/plus-circle'

// Stylesheet
import '../stylesheets/addForm.css'

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quickAdd: true,
      title: '',
      link: '',
      tags: '',
      showPlaceholderQuick: true,
      showPlaceholder: true
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.postRequest = this.postRequest.bind(this)
    this.handleQuickSubmit = this.handleQuickSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputChangeQuick = this.handleInputChangeQuick.bind(this)
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

  toggleAddType(speed) {
    (speed === 'fast')
      ? this.setState({ quickAdd: true })
      : this.setState({ quickAdd: false })
    }

  handleSubmit (e) {
    e.preventDefault()
    const domainRegex = new RegExp('^(?:https?:)?(?://)?([^/?]+)')
    const unnecessaryWords = ['a', 'and', 'the', 'but', 'as']
    const allSymbolsRegex = new RegExp('/[&/\\#,+()$~%.\'":*?<>{}!]/', 'g')

    const data = {
      title: e.target.title.value ,
      link: e.target.link.value ,
      tags: e.target.tags.value.split(' ').filter(value => value !== ''),
      code: e.target.code.value,
      domain: e.target.link.value.match(domainRegex)[1] || '',
    }

    // create search word arr from tags and title
    data.searchWords = `${e.target.tags.value} ${e.target.title.value}`
      .toLowerCase()
      .replace(allSymbolsRegex, '')
      .split(' ')
      .filter(value => !unnecessaryWords.includes(value) )

    this.postRequest(data)
  }



  handleQuickSubmit(e) {
    e.preventDefault()

    const allSymbolsRegex = new RegExp('/[&/\\#,+()$~%.\'":*?<>{}!]/', 'g')
    const regexPattern = /^(.*)([\n])([\s\S]*)/
    const unnecessaryWords = ['a', 'and', 'the', 'but', 'as']

    const input = e.target.code.value.trim()
    let data = {
      title: '',
      link: '',
      tags: [],
    }

    let body = ''

    // if more than one line, separete into title and body sections
    if (regexPattern.test(input)) {
      data.title = input.match(regexPattern)[1]
      body = input.match(regexPattern)[3]
    }

    // if '##' is in body, separate it, and add it to data.link
      // add remaining body to data.code
    if (/(##)(.*)/.test(body)) {
      data.link = body.match(/(##)(.*)/)[2].trim()
      body = body.replace(/##.*\n/, '')
    }

    data.tags = checkForTags(body)
    data.code = body

    // checks for top 300 tags from stackover in body of text
    function checkForTags(string) {
      let tagsArr = [];
      keywords.forEach((value, index) => {
        if (
          string.includes(` ${value} `)
          || string.includes(`\n${value} `)
          || string.includes(` ${value}\n`)
          || string.includes(`\n${value}\n`)
          || string.trim().substring(0, 'javascript'.length) === value
          || string.trim().substring(string.trim().length -'javascript'.length) === value
        ) {
            tagsArr.push(value)
          }
      })
      return tagsArr;
    }

    // create searchwords Arr from tags and title
    data.searchWords = `${data.tags.join(' ')} ${data.title}`
      .toLowerCase()
      .replace(allSymbolsRegex, '')
      .split(' ')
      .filter(value => !unnecessaryWords.includes(value) )

    this.postRequest(data)
  }

  postRequest(data) {
    console.log(data)
    fetch('http://157.245.192.198:4000/api/code', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }).then(() => this.props.history.push('/'))
  }

  handleInputChange(event) {
    if (event.target.value !== '' && this.state.showPlaceholder) {
      this.setState({
        showPlaceholder: false
      })
    } else if (event.target.value === '' && !this.state.showPlaceholder){
      this.setState({
        showPlaceholder: true
      })
    }
  }

  handleInputChangeQuick(event) {
    if (event.target.value !== '' && this.state.showPlaceholderQuick) {
      this.setState({
        showPlaceholderQuick: false
      })
    } else if (event.target.value === '' && !this.state.showPlaceholderQuick){
      this.setState({
        showPlaceholderQuick: true
      })
    }
  }


  render() {
    const { quickAdd, showPlaceholderQuick, showPlaceholder } = this.state
    return (<div className='addForm__container'>
      <div className='addForm' ref={node => (this.node = node)}>
        <div className='addForm__leftPanel'>
          <div className="addForm__iconContainer">
            <div className={!quickAdd ? "addForm__btnContainer" : ""}>
              <FaPlus className="addForm__editBtn" onClick={() => this.toggleAddType('slow')}/>
            </div>
            <p className="addForm__tooltip">Add</p>
          </div>
          <div className="addForm__iconContainer">
            <div className={quickAdd ? "addForm__btnContainer" : ""}>
              <IoFlash className="addForm__editBtn" onClick={() => this.toggleAddType('fast')}/>
            </div>
            <p className="addForm__tooltip">Quick Add</p>
          </div>
        </div>
        <div className='addForm__rightPanel'>
          <div className='addForm__inner'>
            <Link to='/'>
              <p className='addForm__closeBtn'>
                x
              </p>
            </Link>
            {!quickAdd && (
              <form onSubmit={this.handleSubmit}>
                <h3 className='addForm__header'>Add</h3>
                <div className='form-group'>
                  <input type='text' name='title' className='form-control'
                    required={true} placeholder='Title...' autoComplete="off" />
                </div>
                <div className='form-group'>
                  <input type='text' name='link' default='' className='form-control' placeholder='Link...' autoComplete="off" />
                </div>
                <div className='form-group'>
                  <input type='text' name='tags' className='form-control' placeholder='Tags...' autoComplete="off" />
                </div>
                <div className='form-group'>
                  <div className={showPlaceholder ? 'addForm__placeholder' : 'addForm__placeholder addForm__hidePlaceholder'}>
                    <h6>Instructions:</h6>
                    <p>The first line will automatically be used as the title.<br/>Use ## before link to add link.<br/> Add &lt;&lt; before code blocks and &gt;&gt; after code blocks.</p>
                    <h6>Example:</h6>
                    <p>Print hello world to console<br/>## google.com/printhelloworld<br/>Below is the code to use<br/>&lt;&lt;console.log('hello world')&gt;&gt;</p>

                  </div>
                  <textarea type='text' name='code' default='' className='form-control addForm__codeInput' autoComplete="off" onChange={this.handleInputChange}/>
                </div>
                <button type='submit' name='addBtn' className='btn addForm__btn float-right'>
                  Add
                </button>
              </form>
            )}
            {quickAdd && (
              <form onSubmit={this.handleQuickSubmit}>
                <h3 className='addForm__header'>Quick Add</h3>
                <div className='form-group'>
                  <div className={showPlaceholderQuick ? 'addForm__placeholder' : 'addForm__placeholder addForm__hidePlaceholder'}>
                    <h6>Instructions:</h6>
                    <p>The first line will automatically be used as the title.<br/>Use ## before link to add link.<br/> Add &lt;&lt; before code blocks and &gt;&gt; after code blocks.</p>
                    <h6>Example:</h6>
                    <p>Print hello world to console<br/>## google.com/printhelloworld<br/>Below is the code to use<br/>&lt;&lt;console.log('hello world')&gt;&gt;</p>

                  </div>
                  <textarea type='text' name='code' className='form-control addForm__codeInput__quick' autoComplete="off" onChange={this.handleInputChangeQuick}/>
                </div>

                <button type='submit' name='addBtn' className='btn addForm__btn float-right'>
                  Add
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>)
  }
}


export default withRouter(AddForm)
