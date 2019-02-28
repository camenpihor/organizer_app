import React, { Component } from 'react'

import AppNavigation from 'components/Navigation'
import { BookList } from './BookHome'
import { objectList } from 'api'

import 'style/books.css';

export default class BookArchive extends Component {
  componentDidMount() {
    document.body.classList.add("book-home-page");

    objectList("book")
      .get()
      .then(response => {
        this.setState({
          books: response.data,
          loadingData: false
        });
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/")
          localStorage.setItem("token", null)
        } else {
          console.log(error)
        }
      });
  }

  componentWillUnmount() {
    document.body.classList.remove("book-home-page");
  }

  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  render() {
    const { books } = this.state;

    return (
      <div className="book-page colored-book-list">
        <AppNavigation {...this.props} />

        <BookList books={books} name="archive" />
      </div>
    )
  }
}
