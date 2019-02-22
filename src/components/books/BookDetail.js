import React, { Component } from 'react'
import AppNavigation from 'components/Navigation'


export default class BookHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: 0
    };
  }

  render() {
    const { book } = this.state;

    return (
      <div className="book-page">
        <AppNavigation {...this.props} />

        <h3>Book Detail</h3>
      </div>
    )
  }
}
