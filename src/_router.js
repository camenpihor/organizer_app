import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import Home from "components/Entry";
import { QuestionHome, QuestionDetail, QuestionArchive } from 'components/questions'
import { BookHome, BookDetail, BookArchive } from 'components/books'
import PageNotFound from "components/404"


function PrivateRoute({ component: Component, ...rest }) {
  let authStatus = localStorage.getItem("token") !== null
  return (
    <Route
      {...rest}
      render={props =>
        authStatus === true ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}


const AppRouter = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <PrivateRoute exact path="/questions" component={QuestionHome} />
      <PrivateRoute exact path="/questions/archive" component={QuestionArchive} />
      <PrivateRoute exact path="/questions/:id" component={QuestionDetail} />
      <PrivateRoute exact path="/books" component={BookHome} />
      <PrivateRoute exact path="/books/archive" component={BookArchive} />
      <PrivateRoute exact path="/books/:id" component={BookDetail} />
      <Route component={PageNotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
