import React, { Component } from 'react'
import AppNavigation from 'components/Navigation'

export default class BookArchive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  render() {
    const { books } = this.state;

    return (
      <div className="question-page">
        <AppNavigation {...this.props} />

        <h3>Book Archive</h3>
      </div>
    )
  }
}
