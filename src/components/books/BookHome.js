import React, { Component } from 'react'
import AppNavigation from 'components/Navigation'

import 'style/books.css';

export default class BookHome extends Component {
  componentDidMount() {
    this.setState({ loadingData: false })
  }
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      loadingData: true
    };
  }

  render() {
    const { books, loadingData } = this.state;

    return (
      <div className="book-page">
        {!loadingData &&
          <div>
            <AppNavigation {...this.props} />
            <p className="book-section">Suggestions</p>
            <p className="book-section">Create</p>
            <p className="book-section">Archive</p>
          </div>
        }
      </div>
    )
  }
}
