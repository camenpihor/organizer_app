import moment from 'moment'
import React, { Component } from 'react'
import Moment from 'react-moment'
import { NavLink } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'

import AppNavigation from 'components/Navigation'
import { coreObjectList } from 'api'
import 'style/questions.css';

export default class QuestionArchive extends Component {
  componentDidMount() {
    coreObjectList("question")
      .get()
      .then(response => {
        this.setState({
          questions: response.data
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
