import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import Button from '../../components/button';
import Input from '../../components/input';

import { setLoginUserInfo } from '../../store/login_info/actionCreators';

import { login } from './api';

import styles from './styles.module.scss';

class Login extends React.PureComponent {
  state = {
    username: '',
    password: '',
    validationError: '',
  };

  handleSubmit = (event) => {
    event.preventDefault();
    login(
      this.state,
      (userInfo) => {
        localStorage.setItem('token', userInfo.token);
        this.props.setLoginUserInfo({
          ...userInfo
        });
        this.props.history.push('/dashboard');
      },
      (errorMessage) => {
        this.setState({ validationError: errorMessage });
      },
    );
  }

  onUsernameChange = (event) => {
    this.setState({ 
      username: event.target.value,
      validationError: '',
    });
  };

  onPasswordChange = (event) => {
    this.setState({ 
      password: event.target.value,
      validationError: '',
    });
  };

  render() {
    const {
      username,
      password,
      validationError,
    } = this.state;
    return (
      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            Please enter your credentials to use the TimeZone app
          </div>
        </header>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <Input 
            active
            id="username" 
            onChange={this.onUsernameChange}
            value={username} 
            label="Username" 
          />
          <Input 
            id="password" 
            autoComplete="current-password"
            type="password"
            onChange={this.onPasswordChange}
            value={password} 
            label="Password" 
          />
          <Button>Login</Button>
          <span className={styles['error-message']}>{validationError}&nbsp;</span> 
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLoginUserInfo: (userInfo) => dispatch(setLoginUserInfo(userInfo)),
});

export default withRouter(connect(null, mapDispatchToProps)(Login));
