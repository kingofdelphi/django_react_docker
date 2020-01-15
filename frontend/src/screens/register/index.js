import React from 'react';
import { useState } from 'react';

import UserDetail from '../components/userdetail';

import withAPIHelper from '../../middleware/api/util';
import styles from './styles.module.scss';

function Register(props) {
  const [registered, setRegistered] = useState(null);

  const handleSubmit = (userinfo) => {
    setRegistered(userinfo);
  }

  if (registered) {
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
      <UserDetail className={styles.form} onSubmit={handleSubmit} />
    </div>
  );
}

export default withAPIHelper(Register);
