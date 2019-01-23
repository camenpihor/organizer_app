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
  }

  render() {
    const { question } = this.state;

    return (
      <div className="question">
        <AppNavigation pageName="Question Detail" {...this.props} />

        <p>{question.created_at_utc}</p>
        <p>{question.num_views}</p>
        <p>{question.rating}</p>
        <p>{question.question}</p>
      </div>
    )
  }
}
