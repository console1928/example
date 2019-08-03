import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import Main from "./components/main";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path={"/"} component={Main} />
      </Switch>
    </BrowserRouter >
  );
}

export default Router;
