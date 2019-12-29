import React from 'react';
import { withRouter } from "react-router-dom";

import Button from '../../components/button';
import Input from '../../components/input';
import Loading from '../../components/loading';

import { register } from './api';

import styles from './styles.module.scss';

class Register extends React.PureComponent {
  state = {
    username: '',
    password: '',
    password1: '',
    validationError: '',
    fieldErrors: {},
    registered: { },
    loading: false,
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
      password1: this.state.password1,
    };
    this.setState({ loading: true });
    register(
      data,
      (user_info) => {
        this.setState({ registered: user_info, loading: false });
      },
      (message, errorObj) => {
        this.setState({ 
          loading: false,
          validationError: message,
          fieldErrors: errorObj
        });
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

  onPassword1Change = (event) => {
    this.setState({ 
      password1: event.target.value,
      validationError: '',
    });
  };

  render() {
    const {
      username,
      password,
      password1,
      validationError,
      fieldErrors,
      registered,
      loading,
    } = this.state;
    if (registered.username) {
      return (
        <div className={styles.registered}>
          <h3>Thank you for registering, <span>{registered.username}</span></h3>
          You can now use the login page and enter your credentials inorder to use this app.
        </div>
      );
    }
    return (
      <div className={styles.main}>
        { loading && <Loading /> }
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
            invalid={fieldErrors['username']}
            validationMessage={fieldErrors['username']}
          />
          <Input 
            id="password" 
            type="password"
            onChange={this.onPasswordChange}
            value={password} 
            label="Password" 
            invalid={fieldErrors['passwords'] || fieldErrors['password1']}
            validationMessage={fieldErrors['password1']}
          />
          <Input 
            id="password1" 
            type="password"
            onChange={this.onPassword1Change}
            value={password1} 
            label="Reenter Password" 
            invalid={fieldErrors['passwords'] || fieldErrors['password2']}
            validationMessage={fieldErrors['password2']}
          />
          {
            (fieldErrors['passwords'] || []).map((message, i) => (
              <span key={i} className={styles.password_validation}>{message}</span>
            ))
          }
          <Button>Register</Button>
          <span className={styles['error-message']}>{validationError}&nbsp;</span> 
        </form>
      </div>
    );
  }
}

export default withRouter(Register);
