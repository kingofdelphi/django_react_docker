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

import { map_modals_config_to_jsx } from '../store/modals/utils';

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
  componentDidMount() {
    if (getToken()) {
      this.props.setLoginUserInfo({ 
        username: localStorage.getItem('username')
      });
    }
  }

  render() {
    const { modals } = this.props;
    return (
      <div className={styles.container}>
        <NavBar />
        <Router>
          <Switch>
            <RoutesWrapped />
          </Switch>
          {map_modals_config_to_jsx(modals)}
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modals: state.modals,
  loginInfo: state.loginInfo
});

const mapDispatchToProps = (dispatch) => ({
  setLoginUserInfo: (loginUserInfo) => dispatch(setLoginUserInfo(loginUserInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
