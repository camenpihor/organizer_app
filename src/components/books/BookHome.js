import React, { Component } from 'react'
import AppNavigation from 'components/Navigation'
import { List, Card } from 'semantic-ui-react'

import { objectList } from 'api'

import 'style/books.css';

function splitArray(inputArray, N) {
  // so that we don't mutate the inputArray outside of this function
  var newInputArray = inputArray.slice()
  var arrays = [];


  while (newInputArray.length > 0)
    arrays.push(newInputArray.splice(0, N));
  return arrays
}

function BookList(props) {
  const isMobile = window.innerWidth <= 500
  var num_books
  if (isMobile) {
    num_books = 5;
  } else {
    num_books = 10;
  }

  return (
    <div className="bookcase">
      {splitArray(props.books, num_books).map((books, idx) => (
        <List key={idx} horizontal className="shelf">
          {books.map(book => (
            <List.Item key={book.id} className="book" as="a" href={`/books/${book.id}`}>
              <List.Content>
                <List.Header className="book-title">{book.title}</List.Header>
                <div className="book-author">{book.author}</div>
              </List.Content>
            </List.Item>
          ))}
        </List>
      ))}
    </div>
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
              <BookList books={suggestedBooks} name="suggested_books" />
            </div>

            <div className="book-section">
              <p className="book-header">Create</p>
            </div>

            <div className="book-section">
              <p className="book-header">Archive</p>
              <BookList books={books} name="books" />
            </div>
          </div>
        }
      </div>
    )
  }
}
