import React from 'react';
import { withRouter } from "react-router-dom";

import Button from '../../../components/button';
import Input from '../../../components/input';

import { register, updateUser } from './api';

import withAPIHelper from '../../../middleware/api/util';
import styles from './styles.module.scss';

class UserDetail extends React.PureComponent {
  state = {
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password1: '',
    validationError: '',
    fieldErrors: {},
    registered: { },
    oldUserInfo: null,
  };

  constructor(props) {
    super(props);
    this.state = this.handlePropsChange(props);
  }

  handlePropsChange(props) {
    if (this.state.oldUserInfo === props.userInfo) return this.state;
    const { userInfo } = props;
    if (!userInfo) return this.state;
    return { ...this.state, ...userInfo, oldUserInfo: userInfo };
  }

  componentWillReceiveProps(props) {
    this.setState(this.handlePropsChange(props));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { mode } = this.props;
    const data = {
      username: this.state.username,
      password: this.state.password,
      password1: this.state.password1,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
    };
    if (mode === 'update') {
      this.props.makeApiCall(
        updateUser(
          this.props.user_id,
          data,
          (user_info) => {
            this.setState({ fieldErrors: {}, validationError: '' });
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
    this.setState({ 
      username: event.target.value,
    });
  };

  onPasswordChange = (event) => {
    this.setState({ 
      password: event.target.value,
    });
  };

  onPassword1Change = (event) => {
    this.setState({ 
      password1: event.target.value,
    });
  };

  render() {
    const {
      username,
      first_name,
      last_name,
      password,
      password1,
      validationError,
      fieldErrors,
    } = this.state;

    const {
      className,
      submitName = 'Register',
    } = this.props;

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
          id="first_name" 
          onChange={(e) => this.setState({ first_name: e.target.value })}
          value={first_name} 
          label="First Name" 
          invalid={fieldErrors['first_name']}
          validationMessage={fieldErrors['first_name']}
        />
        <Input 
          id="last_name" 
          onChange={(e) => this.setState({ last_name: e.target.value })}
          value={last_name} 
          label="Last Name" 
          invalid={fieldErrors['last_name']}
          validationMessage={fieldErrors['last_name']}
        />
        <Input 
          id="password" 
          type="password"
          onChange={this.onPasswordChange}
          value={password} 
          label="Password" 
          invalid={fieldErrors['passwords'] || fieldErrors['password']}
          validationMessage={fieldErrors['password']}
        />
        <Input 
          id="password1" 
          type="password"
          onChange={this.onPassword1Change}
          value={password1} 
          label="Reenter Password" 
          invalid={fieldErrors['passwords'] || fieldErrors['password1']}
          validationMessage={fieldErrors['password1']}
        />
        {
          (fieldErrors['passwords'] || []).map((message, i) => (
            <span key={i} className={styles.password_validation}>{message}</span>
          ))
        }
        <div className={styles.buttons}>
          <Button>{submitName}</Button>
          {this.props.onCancel && <Button onClick={this.props.onCancel}>Cancel</Button>}
        </div>
        <span className={styles['error-message']}>{validationError}&nbsp;</span> 
      </form>
    );
  }
}

export default withRouter(withAPIHelper(UserDetail));

