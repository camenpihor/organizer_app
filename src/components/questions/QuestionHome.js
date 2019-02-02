import React, { Component } from 'react'
import moment from 'moment'
import Moment from 'react-moment'
import { NavLink } from 'react-router-dom'
import { Button, Card, Form, Grid, Icon, Message } from 'semantic-ui-react'
import Markdown from 'react-markdown'
import AppNavigation from 'components/Navigation'
import { coreObjectList, coreObjectNotebook, getRandomSubset } from 'api'
import 'style/questions.css';


class Notebook extends Component {
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
          sessionStorage.setItem("token", null)
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
      errorMessage: null
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
              sessionStorage.setItem("token", null)
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
              sessionStorage.setItem("token", null)
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

  editText = () => {
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
      <div className="home-section" ref={this.notebookRef}>
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
          <div onMouseDown={this.handleMarkdownClick}>
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

class QuestionForm extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.handleShowQuestionForm, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleShowQuestionForm, false);
  }

  constructor(props) {
    super(props);
    this.questionForm = React.createRef();
    this.state = {
      visible: false,
      error: null,
      success: null,
      errorMessage: null,
      questionID: null,
      question: null
    };
  }

  handleShowQuestionForm = (event) => {
    if (event.ctrlKey && event.key === 'n') {
      window.removeEventListener("keydown", this.handleShowQuestionForm, false);
      this.showQuestionForm()
    }
  }

  showQuestionForm = () => {
    this.setState({
      visible: true
    }, () => {
      window.scrollTo({
        top: this.questionForm.current.offsetTop,
        behavior: "smooth"
      });
    })
  }

  handleQuestionFormSubmit = (event) => {
    const data = new FormData(event.target)
    coreObjectList("question")
      .post(data)
      .then(response => {
        this.setState({
          success: true,
          questionID: response.data.id,
          question: response.data.question
        }, () => {
          document.getElementById("question-form").reset();
        });
        setTimeout(function () {
          this.setState({ success: null });
        }.bind(this), 5000);
      })
      .catch(error => {
        this.setState({
          error: true,
          errorMessage: error
        });
        setTimeout(function () {
          this.setState({ error: null, errorMessage: null });
        }.bind(this), 5000);
      })
  }

  render() {
    const { visible, error, success, errorMessage, question, questionID } = this.state;

    return (
      <div className="home-section">
        {!visible &&
          < Button icon circular size="huge" className="create-button" onClick={this.showQuestionForm} >
            <Icon name='add' />
          </Button >
        }
        {visible &&
          <div ref={this.questionForm}>
            <p className="question-header">Create</p>
            <Form
              onSubmit={this.handleQuestionFormSubmit}
              error={error}
              success={success}
              id="question-form"
            >
              <Form.Input placeholder='Rating' type='number' max={100} name="rating" />
              <Form.TextArea placeholder='Question' name="question" autoFocus />
              <Message
                success
                header='Question Created'
                as={NavLink}
                to={`/questions/${questionID}`}
                content={question}
              />
              <Message error header='Form Error' content={errorMessage} />
              <Button type='submit'>Submit</Button>
            </Form>
          </div>
        }
      </div>
    );
  }
}

function QuestionStats() {
  return (
    <div className="home-section">
      <ul className="question-list">
        <li className="question-list-item">Last edit:</li>
        <li className="question-list-item">Longest streak:</li>
        <li className="question-list-item">Edits per month:</li>
        <li className="question-list-item">Number of questions:</li>
        <li className="question-list-item">Number of forgotten questions:</li>
      </ul>
    </div>
  )
}

class QuestionList extends Component {
  componentDidMount() {
    coreObjectList("question")
      .get()
      .then(response => {
        this.setState({
          questions: getRandomSubset(response.data, 5)
        });
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/")
          sessionStorage.setItem("token", null)
        } else {
          console.log(error)
        }
      })
  }

  constructor(props) {
    super(props);
    this.state = {
      questions: [],
    };
  }

  render() {
    const { questions } = this.state;

    return (
      <div className="home-section" >
        <Grid columns={2} divided className="question-grid">
          {questions.map(question => (
            <Grid.Row key={question.id} as={NavLink} to={`/questions/${question.id}`}>
              <Grid.Column className="column date">
                <Moment format="MMM DD YYYY">
                  {question.created_at_utc}
                </Moment>
              </Grid.Column>
              <Grid.Column className="column text">
                {question.question}
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      </div>
    )
  }
}

function QuestionLinks() {
  const links = [
    { title: "SlateStarCodex", url: "https://slatestarcodex.com" },
    { title: "LessWrong", url: "https://lesswrong.com" },
    { title: "The Zvi", url: "https://thezvi.wordpress.com" },
    { title: "Overcoming Bias", url: "http://www.overcomingbias.com" },
    { title: "Melting Asphalt", url: "http://meltingasphalt.com" }
  ]

  return (
    <div className="home-section" >
      <Card.Group itemsPerRow={2}>
        {links.map(link => (
          <Card
            href={link.url}
            header={link.title}
            rel="noopener noreferrer"
            target="_blank"
            key={link.title}
            meta={link.url}
          />
        ))}
      </Card.Group>
    </div>
  )
}



export default class QuestionHome extends Component {
  render() {
    return (
      <div className="question-page">
        <AppNavigation {...this.props} />

        <p className="question-header">Stats</p>
        <QuestionStats />

        <p className="question-header">Random Questions</p>
        <QuestionList {...this.props} />

        <p className="question-header">Links</p>
        <QuestionLinks />

        <QuestionForm />

        <p className="question-header">Notebook</p>
        <Notebook {...this.props} />
      </div>
    );
  }
}
