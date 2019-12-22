import React from 'react';
import { withRouter } from "react-router-dom";

import Button from '../../components/button';
import Input from '../../components/input';


import { login } from './api';

import styles from './styles.module.scss';

class Login extends React.PureComponent {
  state = {
    username: '',
    password: '',
    validation_error: '',
  };

  handleSubmit = (event) => {
    event.preventDefault();
    login(
      this.state,
      (user_info) => {
        localStorage.setItem('token', user_info.token);
        this.props.history.push('/dashboard');
      },
      (error_message) => {
        this.setState({ validation_error: error_message });
      },
    );
  }

  onUsernameChange = (event) => {
    this.setState({ 
      username: event.target.value,
      validation_error: '',
    });
  };

  onPasswordChange = (event) => {
    this.setState({ 
      password: event.target.value,
      validation_error: '',
    });
  };

  render() {
    const {
      username,
      password,
      validation_error,
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
            type="password"
            onChange={this.onPasswordChange}
            value={password} 
            label="Password" 
          />
          <Button>Login</Button>
          <span className={styles['error-message']}>{validation_error}&nbsp;</span> 
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
