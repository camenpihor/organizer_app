import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import Home from "components/Entry";
import { QuestionHome, QuestionDetail, QuestionArchive } from 'components/questions'
import PageNotFound from "components/404"


function PrivateRoute({ component: Component, ...rest }) {
  let authStatus = sessionStorage.getItem("token") !== null
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
      <Route component={PageNotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
