import moment from 'moment'
import React, { Component } from 'react'
import Moment from 'react-moment'
import { NavLink } from 'react-router-dom'
import { Button, Form, Grid, Icon } from 'semantic-ui-react'

import AppNavigation from './Navigation'
import { coreObjectDetail, coreObjectList, getRandomSubset } from '../api'
import '../style/questions.css';

const links = [
  { title: "SlateStarCodex", url: "https://slatestarcodex.com" },
  { title: "LessWrong", url: "https://lesswrong.com" },
  { title: "The Zvi", url: "https://thezvi.wordpress.com/" },
  { title: "Overcoming Bias", url: "http://www.overcomingbias.com" },
  { title: "Melting Asphalt", url: "http://meltingasphalt.com" }
]

class QuestionHome extends Component {
  componentDidMount() {
    coreObjectList("question")
      .get()
      .then(response => {
        this.setState({
          questions: getRandomSubset(response.data, 5)
        });
      })
    window.addEventListener("keydown", this.handleShowQuestionForm, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleShowQuestionForm, false);
  }

  constructor(props) {
    super(props);
    this.questionForm = React.createRef();
    this.state = {
      questions: [],
      formVisible: false
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
      formVisible: true
    }, () => {
      window.scrollTo({
        top: this.questionForm.current.offsetTop,
        behavior: "smooth"
      });
    })
  }

  render() {
    const { questions, formVisible } = this.state;

    return (
      <div className="question" >
        <AppNavigation {...this.props} />

        {/* Stats */}
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

        {/* Random Questions */}
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

        {/* Links */}
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

        {/* Create */}
        <div className="home-section">
          {!formVisible &&
            < Button icon circular size="huge" className="create-button" onClick={this.showQuestionForm} >
              <Icon name='add' />
            </Button >
          }
          {formVisible &&
            <div ref={this.questionForm}>
              <h3>Create</h3>
              <Form>
                <Form.Field>
                  <label>First Name</label>
                  <input placeholder='First Name' />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input placeholder='Last Name' />
                </Form.Field>
                <Button type='submit'>Submit</Button>
              </Form>
            </div>
          }
        </div>
      </div>
    );
  }
}


class QuestionArchive extends Component {
  componentDidMount() {
    coreObjectList("question")
      .get()
      .then(response => {
        this.setState({
          questions: response.data
        });
      })
  }

  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      years: [2019, 2018]
    };
  }

  render() {
    const { questions, years } = this.state;

    return (
      <div className="question">
        <AppNavigation {...this.props} />

        {years.map(year => (
          <div key={year} className="year-section">
            <h3>{year}</h3>

            <Grid columns={2} divided>
              {questions.filter(question => {
                return moment(question.created_at_utc).year() === year
              }).map(question => (

                <Grid.Row key={question.id} as={NavLink} to={`/questions/${question.id}`}>

                  <Grid.Column className="date-column">
                    <Moment format="MMM DD">{question.created_at_utc}</Moment>
                  </Grid.Column>
                  <Grid.Column className="text-column">{question.question}</Grid.Column>

                </Grid.Row>
              ))}
            </Grid>
          </div>
        ))}
      </div>
    )
  }
}


class QuestionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: 0,
    };
  }

  componentDidMount() {
    coreObjectDetail("question", this.props.match.params.id)
      .get()
      .then(response => {
        this.setState({
          question: response.data
        });
      })
  }

  render() {
    const { question } = this.state;

    return (
      <div className="question">
        <AppNavigation pageName="Question Detail" {...this.props} />

        <p>{question.id}</p>
        <p>{question.created_at_utc}</p>
        <p>{question.num_views}</p>
        <p>{question.rating}</p>
        <p>{question.question}</p>
      </div>
    )
  }

}


export { QuestionHome, QuestionArchive, QuestionDetail };
