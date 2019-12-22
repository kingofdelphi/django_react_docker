import React from 'react';
import { withRouter } from "react-router-dom";

import Button from '../../components/button';
import Input from '../../components/input';


import { register } from './api';

import styles from './styles.module.scss';

class Register extends React.PureComponent {
  state = {
    username: '',
    password: '',
    password1: '',
    validation_error: '',
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
      password1: this.state.password1,
    };
    register(
      data,
      (user_info) => {
        console.log(user_info);
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

  onPassword1Change = (event) => {
    this.setState({ 
      password1: event.target.value,
      validation_error: '',
    });
  };

  render() {
    const {
      username,
      password,
      password1,
      validation_error,
    } = this.state;
    return (
      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            Enter proper username and password and click the Register button.
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
          <Input 
            id="password1" 
            type="password"
            onChange={this.onPassword1Change}
            value={password1} 
            label="Reenter Password" 
          />
          <Button>Register</Button>
          <span className={styles['error-message']}>{validation_error}&nbsp;</span> 
        </form>
      </div>
    );
  }
}

export default withRouter(Register);
