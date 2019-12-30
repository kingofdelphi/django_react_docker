import React from 'react';
import { connect } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";

import HomePage from '../screens/home';
import Login from '../screens/login';
import Logout from '../screens/logout';
import Register from '../screens/register';
import Dashboard from '../screens/dashboard';
import Profile from '../screens/profile';

import NavBar from '../screens/components/navbar';

import styles from './styles.module.scss';

import { 
  setLoginUserInfo,
  setUserAsGuest,
} from '../store/login_info/actionCreators';

const guest_user_routes = ['/', '/login', '/register'];

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null') {
    return null;
  }
  return token;
};

class RoutesValidator extends React.PureComponent {
  validateRoutes() {
    const location = this.props.location.pathname;
    let redirectTo = '';
    if (!getToken()) {
      // if not logged in
      if (!guest_user_routes.includes(location)) {
        redirectTo = '/login';
      }
    } else {
      // if logged in, redirect to dashboard
      if (guest_user_routes.includes(location)) {
        redirectTo = '/dashboard';
      }
    }
    return redirectTo;
  }

  render() {
    const redirection = this.validateRoutes();
    if (redirection) {
      return <Redirect to={redirection} />;
    }
    return (
      <div className={styles.body}>
        <Switch>
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
          <Route path="/profile/">
            <Profile />
          </Route>
        </Switch>
      </div>
    );
  }
}

const RoutesValidatorE = withRouter(RoutesValidator);

class App extends React.Component {
  componentDidMount() {
    if (getToken()) {
      this.props.setLoginUserInfo({ 
        username: localStorage.getItem('username')
      });
    } else {
      this.props.setUserAsGuest();
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Router>
          <RoutesValidatorE />
          <NavBar />
        </Router>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLoginUserInfo: (loginUserInfo) => dispatch(setLoginUserInfo(loginUserInfo)),
  setUserAsGuest: () => dispatch(setUserAsGuest()),
});

export default connect(null, mapDispatchToProps)(App);
