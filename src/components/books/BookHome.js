import React, { Component } from 'react'
import AppNavigation from 'components/Navigation'
import { List } from 'semantic-ui-react'

import { objectList } from 'api'

import 'style/books.css';

function BookList(props) {
  return (
    <List horizontal>
      {props.books.map(book => (
        <List.Item key={book.id}>
          <List.Content>
            <List.Header>{book.title}</List.Header>
            <span>{book.author}</span>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}


export default class BookHome extends Component {
  componentDidMount() {
    objectList("book")
      .get()
      .then(response => {
        this.setState({
          books: response.data
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

    objectList("suggestedbook")
      .get()
      .then(response => {
        this.setState({
          suggestedBooks: response.data
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

    this.setState({ loadingData: false });
  }
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      suggestedBooks: [],
      loadingData: true
    };
  }

  render() {
    const { books, suggestedBooks, loadingData } = this.state;

    return (
      <div className="book-page">
        {!loadingData &&
          <div>
            <AppNavigation {...this.props} />
            <div className="book-section">
              <p className="book-header">Suggestions</p>
              <BookList books={suggestedBooks} />
            </div>

            <div className="book-section">
              <p className="book-header">Create</p>
            </div>

            <div className="book-section">
              <p className="book-header">Archive</p>
              <BookList books={books} />
            </div>
          </div>
        }
      </div>
    )
  }
}
