import Moment from 'react-moment'
import React, { Component } from 'react'

import AppNavigation from 'components/Navigation'
import { coreObjectDetail } from 'api'

import 'style/questions.css';

export default class QuestionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: 0
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
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/")
          localStorage.setItem("token", null)
        } else {
          console.log(error)
        }
      })
  }

  render() {
    const { question } = this.state;

    return (
      <div className="question-page">
        <AppNavigation pageName="Question Detail" {...this.props} />
        <h3>Question</h3>
        <p>
          <Moment format="MMM DD YYYY">
            {question.created_at_utc}
          </Moment>
        </p>
        <p>Numbier of views: {question.num_views}</p>
        <p>Rating: {question.rating}</p>
        <p>{question.question}</p>
      </div>
    )
  }
}
