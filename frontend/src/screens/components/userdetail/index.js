import React from 'react';
import { withRouter } from "react-router-dom";

import Button from '../../../components/button';
import Input from '../../../components/input';

import { register, updateUser } from './api';

import withAPIHelper from '../../../middleware/api/util';
import styles from './styles.module.scss';

class UserDetail extends React.PureComponent {
  state = {
    username: this.props.username || '',
    password: '',
    password1: '',
    validationError: '',
    fieldErrors: {},
    registered: { },
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { mode } = this.props;
    const data = {
      username: mode === 'update' ? this.props.username : this.state.username,
      password: this.state.password,
      password1: this.state.password1,
    };
    if (mode === 'update') {
      this.props.makeApiCall(
        updateUser(
          this.props.user_id,
          data,
          (user_info) => {
            this.props.onSubmit(user_info);
          },
          (message, errorObj) => {
            this.setState({ 
              validationError: message,
              fieldErrors: errorObj
            });
          },
        )
      );
    } else {
      this.props.makeApiCall(
        register(
          data,
          (user_info) => {
            this.props.onSubmit(user_info);
          },
          (message, errorObj) => {
            this.setState({ 
              validationError: message,
              fieldErrors: errorObj
            });
          },
        )
      );
    }
  }

  onUsernameChange = (event) => {
    if (this.props.onUsernameChange) {
      this.props.onUsernameChange(event.target.value);
      this.setState({ 
        validationError: '',
      });
    } else {
      this.setState({ 
        username: event.target.value,
        validationError: '',
      });
    }
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
      password,
      password1,
      validationError,
      fieldErrors,
    } = this.state;

    const {
      className,
      submitName = 'Register',
    } = this.props;

    // controlled vs uncontrolled component
    const { username } = this.props.onUsernameChange ? this.props : this.state;

    const cls = [styles.form, className].join(' ');

    return (
      <form className={cls} onSubmit={this.handleSubmit}>
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
        <Button>{submitName}</Button>
        {this.props.onCancel && <Button onClick={this.props.onCancel}>Cancel</Button>}
        <span className={styles['error-message']}>{validationError}&nbsp;</span> 
      </form>
    );
  }
}

export default withRouter(withAPIHelper(UserDetail));

