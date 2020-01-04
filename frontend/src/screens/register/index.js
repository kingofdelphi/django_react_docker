import React from 'react';
import { withRouter } from "react-router-dom";

import UserDetail from '../components/userdetail';

import withAPIHelper from '../../middleware/api/util';
import styles from './styles.module.scss';

class Register extends React.PureComponent {
  state = {
    registered: {}
  }

  handleSubmit = (userinfo) => {
    this.setState({ registered: userinfo });
  }

  render() {
    const {
      registered,
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
        <header className={styles.header}>
          <div>
            Enter proper username and password and click the Register button.
          </div>
        </header>
        <UserDetail className={styles.form} onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default withRouter(withAPIHelper(Register));
