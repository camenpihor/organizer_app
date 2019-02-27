import Moment from 'react-moment'
import React, { Component } from 'react'

import AppNavigation from 'components/Navigation'
import { objectDetail } from 'api'


export default class BookHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: 0
    };
  }

  componentDidMount() {
    objectDetail("book", this.props.match.params.id)
      .get()
      .then(response => {
        this.setState({
          book: response.data
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
    const { book } = this.state;

    return (
      <div className="book-page">
        <AppNavigation {...this.props} />

        <h3>{book.title}</h3>
        <h5>{book.author}</h5>
        <h5>{book.genre}</h5>
        <h3>{book.suggester}</h3>
        <p>
          <Moment format="MMM DD YYYY">
            {book.created_at_utc}
          </Moment>
        </p>
        <p>Numbier of views: {book.num_views}</p>
        <p>Rating: {book.rating}</p>
      </div>
    )
  }
}
