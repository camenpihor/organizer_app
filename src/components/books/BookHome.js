import React, { Component } from 'react'
import AppNavigation from 'components/Navigation'
import { List } from 'semantic-ui-react'

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
            <List.Item key={book.id} className={`book ${book.genre}`} as="a" href={`/books/${book.id}`}>
              <List.Content>
                <List.Header className="book-title">{book.title}</List.Header>
                <div className="book-author">{book.author}</div>
                <div className="book-genre">{book.genre}</div>
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
      loadingData: true
    };
  }

  splitReadBooks = (allBooks) => {
    let readBooks = []
    let unreadBooks = []
    let currentlyReading = []
    allBooks.forEach(book => {
      if (book.read === true) {
        readBooks.push(book);
      } else if (book.reading === true) {
        currentlyReading.push(book);
      } else {
        unreadBooks.push(book);
      }
    })
    return {
      readBooks: readBooks,
      unreadBooks: unreadBooks,
      currentlyReading: currentlyReading
    }
  }

  render() {
    const { books, loadingData } = this.state;
    const { readBooks, unreadBooks, currentlyReading } = this.splitReadBooks(books);

    return (
      <div className="book-page">
        {!loadingData &&
          <div>
            <AppNavigation {...this.props} />

            <div className="book-section colored-book-list">
              <div className="book-header">Currently Reading</div>
              <BookList books={currentlyReading} name="suggested_books" />
            </div>

            <div className="book-section colored-book-list">
              <div className="book-header">Suggestions</div>
              <BookList books={unreadBooks} name="suggested_books" />
            </div>

            <div className="book-section colored-book-list">
              <div className="book-header">Read</div>
              <BookList books={readBooks} name="books" />
            </div>
{/*
            <div className="book-section">
              <p className="book-header">Create</p>
            </div> */}
          </div>
        }
      </div>
    )
  }
}
