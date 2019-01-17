import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "../components/Entry";
import { QuestionHome, QuestionArchive, QuestionDetail } from "../components/Questions";
import PageNotFound from "../components/404"

const AppRouter = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/questions" component={QuestionHome} />
      <Route exact path="/questions/archive" component={QuestionArchive} />
      <Route exact path="/questions/:id" component={QuestionDetail} />
      <Route component={PageNotFound} />
    </Switch>
  </Router>
);

export default AppRouter;
