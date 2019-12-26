import React from 'react';
import { connect } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import HomePage from '../screens/home';
import Login from '../screens/login';
import Logout from '../screens/logout';
import Register from '../screens/register';
import Dashboard from '../screens/dashboard';

import NavBar from '../screens/components/navbar';

import styles from './styles.module.scss';

import { setLoginUserInfo } from '../store/login_info/actionCreators';

const guest_user_routes = ['/', '/login', '/register'];

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined') {
    return null;
  }
  return token;
};

class Routes extends React.Component {
  componentDidMount() {
    this.validateRoutes();
  }

  validateRoutes() {
    const location = this.props.location.pathname;
    if (!getToken()) {
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

  // called on browser back or hash name change on url
  // as we have wrapepd it around withRouter which
  // will send the changed params as props
  componentDidUpdate() {
    this.validateRoutes();
  }

  render() {
    return (
      <div className={styles.body}>
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
      </div>
    );
  }
}

const RoutesWrapped = withRouter(Routes); 

class App extends React.Component {
  componentDidMount() {
    if (getToken()) {
      this.props.setLoginUserInfo({ 
        username: localStorage.getItem('username')
      });
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Router>
          <NavBar />
          <Switch>
            <RoutesWrapped />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLoginUserInfo: (loginUserInfo) => dispatch(setLoginUserInfo(loginUserInfo)),
});

export default connect(null, mapDispatchToProps)(App);
