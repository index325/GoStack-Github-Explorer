import React from "react";
import Dashboard from "../pages/Dashboard";
import Repository from "../pages/Repository";
import { Switch, Route } from "react-router-dom";

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/repository/:repository+" component={Repository} />
  </Switch>
);

export default Routes;
