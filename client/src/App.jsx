import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Post from "./pages/Post";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path = "/" component = {Post} />
        <Route exact path = "/login" component = {Login} />
        <Route exact path = "/register" component = {Register} />
      </Switch>
    </Router>
  );
}
export default App;