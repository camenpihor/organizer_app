import React, { Component } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { Button, Card, Form, Icon, Message, Segment } from 'semantic-ui-react'
import Notebook from 'components/Notebook'
import AppNavigation from 'components/Navigation'
import { coreObjectList, getRandomSubset } from 'api'
import 'style/questions.css';


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
          localStorage.setItem("token", null)
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

  navigateTo = (url) => {
    this.props.history.push(url)
  }

  render() {
    const { questions } = this.state;

    return (
      <div>
        <Card.Group itemsPerRow={1}>
          {questions.map(question => (
            <Card
              key={question.id}
              className="question-link"
            >
              <Card.Content as="a" href={`/questions/${question.id}`}>
                <Card.Header>
                  {question.question}
                </Card.Header>
                <Card.Meta>
                  {moment(question.created_at_utc).format('ll')}
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
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
    <div>
      <Card.Group itemsPerRow={2} doubling>
        {links.map(link => (
          <Card
            key={link.title}
            className="question-link"
          >
            <Card.Content as="a" href={link.url} target="_blank" rel="noopener noreferrer">
              <Card.Header>{link.title}</Card.Header>
              <Card.Meta>{link.url}</Card.Meta>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  )
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
      <div>
        {!visible &&
          <Button icon circular size="huge" className="create-button" onClick={this.showQuestionForm} >
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
              <Form.Input className="question-form-input" placeholder='Rating' type='number' max={100} name="rating" />
              <Form.TextArea className="question-form-input" placeholder='Question' name="question" autoFocus />
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


export default class QuestionHome extends Component {
  render() {
    return (
      <div className="question-page">
        <AppNavigation {...this.props} />

        <div className="question-section">
          <p className="question-header">Random Questions</p>
          <QuestionList {...this.props} />
        </div>

        <div className="question-section">
          <p className="question-header">Links</p>
          <QuestionLinks />
        </div>

        <div className="question-section">
          <QuestionForm />
        </div>

        <Segment className="notebook">
          <p className="question-header">Notebook</p>
          <Notebook {...this.props} />
        </Segment>

      </div>
    );
  }
}
