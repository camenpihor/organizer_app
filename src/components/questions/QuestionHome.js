import React, { Component } from 'react'
import Moment from 'react-moment'
import { NavLink } from 'react-router-dom'
import { Button, Form, Grid, Icon, Message } from 'semantic-ui-react'

import AppNavigation from 'components/Navigation'
import { coreObjectList, getRandomSubset } from 'api'
import 'style/questions.css';

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
      })
      .catch(error => {
        this.setState({
          error: true,
          errorMessage: error
        });
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
            <h3>Create</h3>
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
    <div>
      <h3>Stats</h3>
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
        <h3>Random Questions</h3>
        <Grid columns={2} divided>
          {questions.map(question => (
            <Grid.Row key={question.id} as={NavLink} to={`/questions/${question.id}`}>
              <Grid.Column className="date-column">
                <Moment format="MMM DD YYYY">
                  {question.created_at_utc}
                </Moment>
              </Grid.Column>
              <Grid.Column className="text-column">
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
    { title: "The Zvi", url: "https://thezvi.wordpress.com/" },
    { title: "Overcoming Bias", url: "http://www.overcomingbias.com" },
    { title: "Melting Asphalt", url: "http://meltingasphalt.com" }
  ]

  return (
    <div className="home-section" >
      <h3>Links</h3>
      <ul className="question-list">
        {links.map(link => (
          <li className="question-list-item" key={link.title}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}



export default class QuestionHome extends Component {
  render() {
    return (
      <div className="question" >
        <AppNavigation {...this.props} />
        <QuestionStats />
        <QuestionList />
        <QuestionLinks />
        <QuestionForm />
      </div>
    );
  }
}
