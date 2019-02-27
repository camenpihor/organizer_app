import Moment from 'react-moment'
import React, { Component } from 'react'

import AppNavigation from 'components/Navigation'
import { objectDetail } from 'api'

import 'style/questions.css';

export default class QuestionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: 0
    };
  }

  componentDidMount() {
    objectDetail("question", this.props.match.params.id)
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
        <AppNavigation {...this.props} />
        <h3>{question.question}</h3>
        <p>
          <Moment format="MMM DD YYYY">
            {question.created_at_utc}
          </Moment>
        </p>
        <p>Numbier of views: {question.num_views}</p>
        <p>Rating: {question.rating}</p>
      </div>
    )
  }
}
