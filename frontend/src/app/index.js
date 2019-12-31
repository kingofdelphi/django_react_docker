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
import Users from '../screens/users';

import NavBar from '../screens/components/navbar';

import withAPIHelper from '../middleware/api/util';

import { get_user_info } from './api'

import * as LoginStates from '../store/login_info/login_states';

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
    const {
      location: { pathname },
      loginInfo,
    } = this.props;

    if (!loginInfo.username) {
      // if not logged in
      if (!guest_user_routes.includes(pathname)) {
        return '/login';
      }
    } else {
      // if logged in, redirect to dashboard
      if (guest_user_routes.includes(pathname)) {
        return '/dashboard';
      }
    }
    return '';
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
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/profile/">
            <Profile />
          </Route>
          <Route exact path="/users/">
            <Users />
          </Route>
        </Switch>
      </div>
    );
  }
}

const route_mapStateToProps = state => ({
  loginInfo: state.loginInfo,
});

const RoutesValidatorE = connect(route_mapStateToProps)(withRouter(RoutesValidator));

class App extends React.Component {
  componentDidMount() {
    const token = getToken();
    if (token) {
      this.props.makeApiCall(
        get_user_info(
          (user_info) => {
            this.props.setLoginUserInfo(user_info);
          },
          () => {
            // todo: session expiry refresh no message
            localStorage.removeItem('token');
            this.props.setUserAsGuest();
          }
        )
      );
    } else {
      localStorage.removeItem('token');
      this.props.setUserAsGuest();
    }
  }

  render() {
    const {
      loginInfo,
    } = this.props;

    const fetching = loginInfo.loginStatus === LoginStates.Fetching;

    if (fetching) {
      return '';
    }

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

const mapStateToProps = state => ({
  loginInfo: state.loginInfo,
});

const mapDispatchToProps = (dispatch) => ({
  setLoginUserInfo: (loginUserInfo) => dispatch(setLoginUserInfo(loginUserInfo)),
  setUserAsGuest: () => dispatch(setUserAsGuest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withAPIHelper(App));
