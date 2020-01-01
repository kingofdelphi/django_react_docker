import React from 'react';
import { connect } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import HomePage from '../screens/home';
import Login from '../screens/login';
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

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null') {
    return null;
  }
  return token;
};

const routesMap = {
  auth: [
    { path: '/dashboard', component: Dashboard },
    { path: '/profile', component: Profile },
    { path: '/users', component: Users },
  ],
  non_auth: [
    { path: '/', component: HomePage },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
  ]
};

class RoutesValidator extends React.PureComponent {
  render() {
    const {
      loginInfo,
    } = this.props;

    const isLoggedIn = loginInfo.username;

    return (
      <div className={styles.body}>
        <Switch>
          {
            routesMap.non_auth.map(({ path, component: Component }) => {
              return (
                <Route key={path} path={path} exact>
                  { !isLoggedIn && <Component /> }
                  { isLoggedIn && <Redirect to='/dashboard' /> }
                </Route>
              );
            })
          }
          {
            routesMap.auth.map(({ path, component: Component }) => {
              return (
                <Route key={path} path={path} exact>
                  { isLoggedIn && <Component /> }
                  { !isLoggedIn && <Redirect to='/' /> }
                </Route>
              );
            })
          }
        </Switch>
      </div>
    );
  }
}

const route_mapStateToProps = state => ({
  loginInfo: state.loginInfo,
});

const RoutesValidatorE = connect(route_mapStateToProps)(RoutesValidator);

class Main extends React.PureComponent {
  componentDidMount() {
    const token = getToken();
    if (token) {
      this.props.makeApiCall(
        get_user_info(
          (user_info) => {
            this.props.setLoginUserInfo(user_info);
          },
          (message) => {
            // todo: session expiry refresh no message
            if (message === 'Invalid credentials') {
              this.props.logoutUser();
            }
          }
        )
      );
    } else {
      this.props.setUserAsGuest();
    }
  }

  render() {
    const {
      loginInfo,
    } = this.props;

    const fetching = loginInfo.loginStatus === LoginStates.Fetching;

    if (fetching) {
      // must determine login status before rendering
      // as active user must be computed for dashboard routes
      return 'fetching...';
    }

    return (
      <>
        <RoutesValidatorE />
        <NavBar />
      </>
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

const MainE = connect(mapStateToProps, mapDispatchToProps)(withAPIHelper(Main));

class App extends React.PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <Router>
          <MainE />
        </Router>
      </div>
    );
  }
}

export default App;
