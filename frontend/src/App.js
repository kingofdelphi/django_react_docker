import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import HomePage from './screens/home';
import Login from './screens/login';
import Logout from './screens/logout';
import Register from './screens/register';
import Dashboard from './screens/dashboard';

const guest_user_routes = ['/', '/login', '/register'];

class Routes extends React.Component {
  componentDidMount() {
    const location = this.props.location.pathname;
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
      // if not logged in
      if (!guest_user_routes.includes(location)) {
        this.props.history.push('/');
      }
    } else {
      // if logged in, redirect to dashboard
      if (guest_user_routes.includes(location)) {
        this.props.history.push('/dashboard');
      }
    }
  }

  render() {
    return (
      <>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
      </>
    );
  }
}

const RoutesWrapped = withRouter(Routes); 

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <RoutesWrapped />
        </Switch>
      </Router>
    );
  }
}

export default App;
