import React from 'react';
import { connect } from 'react-redux';
import Button from '../../components/button';
import Input from '../../components/input';

import withAPIHelper from '../../middleware/api/util';
import { setLoginUserInfo } from '../../store/login_info/actionCreators';

import { login } from './api';

import styles from './styles.module.scss';

class Login extends React.PureComponent {
  state = {
    username: '',
    password: '',
    fieldErrors: {},
    validationError: '',
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    this.props.makeApiCall(
      login(data),
      (userInfo) => {
        this.props.setLoginUserInfo(userInfo);
      },
      (message, errorObj) => {
        this.setState({ 
          validationError: message,
          fieldErrors: errorObj
        });
      },
    );
  }

  onUsernameChange = (event) => {
    this.setState({ 
      username: event.target.value,
    });
  };

  onPasswordChange = (event) => {
    this.setState({ 
      password: event.target.value,
    });
  };

  render() {
    const {
      username,
      password,
      fieldErrors,
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
            onChange={this.onUsernameChange}
            value={username} 
            label="Username" 
            invalid={fieldErrors['username']}
            validationMessage={fieldErrors['username']}
          />
          <Input 
            type="password"
            onChange={this.onPasswordChange}
            value={password} 
            label="Password" 
            invalid={fieldErrors['password']}
            validationMessage={fieldErrors['password']}
          />
          <Button>Login</Button>
          <span className={styles['error-message']}>{validationError}&nbsp;</span> 
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setLoginUserInfo,
};

export default connect(null, mapDispatchToProps)(withAPIHelper(Login));
