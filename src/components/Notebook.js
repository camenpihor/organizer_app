import React, { Component } from 'react'
import moment from 'moment'
import { Button, Form, Message } from 'semantic-ui-react'
import Markdown from 'react-markdown'
import { coreObjectNotebook } from 'api'


export default class Notebook extends Component {
  componentDidMount() {
    console.log(new Date())

    coreObjectNotebook("question")
      .get()
      .then(response => {
        this.setState({
          notebook: response.data,
          sourceText: response.data.markdown
        });
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/")
          localStorage.setItem("token", null)
        } else {
          console.log(error)
        }
      })
  }

  componentWillUnmount() {
    this.handleFormSubmit()
  }

  constructor(props) {
    super(props);
    this.notebookRef = React.createRef();
    this.state = {
      showMarkdown: true,
      notebook: null,
      sourceText: "#Notebook\nThis is the beginning of a new notebook.",
      error: null,
      success: null,
      errorMessage: null,
      lastTap: null
    };
  }

  resetMessages = () => {
    this.setState({
      error: null,
      success: null,
      errorMessage: null
    })
  }

  handleFormSubmit = () => {
    // if no new text has been added, don't do anything
    if (this.state.notebook.markdown !== this.state.sourceText) {
      // if notebook already exists, update it
      if (this.state.notebook !== null) {
        let toUpdate = this.state.notebook
        toUpdate.markdown = this.state.sourceText
        coreObjectNotebook("question")
          .put(toUpdate)
          .then(_ => {
            this.setState({ success: true })
            setTimeout(function () {
              this.resetMessages();
            }.bind(this), 5000);
          })
          .catch(error => {
            if (error.response.status === 401) {
              this.props.history.push("/")
              localStorage.setItem("token", null)
            } else {
              this.setState({ error: true })
            }
          })
      } else {  // else if notebook doesn't already exists, create one
        let toCreate = { "markdown": this.state.sourceText, "model_type": "question" }
        coreObjectNotebook("question")
          .post(toCreate)
          .then(_ => {
            this.setState({ success: true })
            setTimeout(function () {
              this.resetMessages();
            }.bind(this), 5000);
          })
          .catch(error => {
            if (error.response.status === 401) {
              this.props.history.push("/")
              localStorage.setItem("token", null)
            } else {
              this.setState({ error: true })
            }
          })
      }
    } else {
      this.setState({ error: true, errorMessage: "There is no new text to save" })
      setTimeout(function () {
        this.resetMessages();
      }.bind(this), 5000);
    }
  }

  handleMarkdownClick = (event) => {
    event.stopPropagation();
    if (event.altKey) {
      this.editText()
    }
  }

  handleTextChange = (e, { value }) => {
    this.setState({ sourceText: value })
  }

  handleMarkdownKeyDown = (event) => {
    if (event.ctrlKey) {
      if (event.key === 's') {
        this.handleFormSubmit()
      } else if (event.key === 'u') {
        const currentText = this.state.sourceText
        const cursorPosition = event.target.selectionStart

        const firstPart = currentText.slice(0, cursorPosition)
        const header = "#### "
        const currentDateTime = moment().format('LLLL')
        const seperator = "*".repeat(5)
        const lastPart = currentText.slice(cursorPosition + 1)
        const newText = firstPart + header + currentDateTime + "\n" + seperator + "\n" + lastPart
        this.setState({ sourceText: newText })
      } else if (event.key === 'r') {
        this.handleFormSubmit()
        this.renderMarkdown()
        this.resetMessages()
      }
    }
  }

  renderMarkdown = () => {
    this.setState({ showMarkdown: true })
  }

  handleDoubleTap = () => {
    const now = Date.now();
    const doubleTapDelay = 300;
    if (this.state.lastTap && (now - this.state.lastTap) < doubleTapDelay) {
      this.editText()
    }
    else {
      this.setState({ lastTap: now })
    }
  }

  editText = () => {
    this.resetMessages();
    this.setState({
      showMarkdown: false
    }, () => {
      window.scrollTo({
        top: this.notebookRef.current.offsetTop,
        behavior: "smooth"
      });
      setTimeout(function () { // I dont know why, byt I need a timeout function here
        document.getElementById("notebook-text").focus();
      }, 0);
    })
  }

  render() {
    const { showMarkdown, sourceText, error, success, errorMessage } = this.state;

    return (
      <div ref={this.notebookRef}>
        {!showMarkdown &&
          <Form
            onSubmit={this.handleFormSubmit}
            error={error}
            success={success}
          >
            <Form.TextArea
              placeholder='Notebook'
              name="notebook"
              id="notebook-text"
              onChange={this.handleTextChange}
              value={sourceText}
              style={{ minHeight: 300 }}
              autoFocus
              onKeyDown={this.handleMarkdownKeyDown}
            />
            <div>
              <Button type="button" onClick={this.renderMarkdown}>Render</Button>
              <Button type='submit'>Save</Button>
            </div>
            <Message
              success
              header='Successfully persisted'
            />
            <Message error header='Form Error' content={errorMessage} />
          </Form>
        }
        {showMarkdown &&
          <div onMouseDown={this.handleMarkdownClick} onTouchEndCapture={this.handleDoubleTap}>
            <Markdown
              source={sourceText}
              linkTarget="_blank"
            />
          </div>
        }
      </div>
    )
  }
}
