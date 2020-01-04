import React from 'react';
import { Link } from 'react-router-dom'

import styles from './styles.module.scss';

class HomePage extends React.PureComponent {
  render() {
    return (
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.greetings}>
            Welcome
          </div>
          <p>
            To use the app you need to login.
            <br />
            <br />
            If you don't have an account yet please use the register
            button below to create one.
          </p>
        </header>
        <section>
          <div className={styles['navigation-links']}>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </div>
        </section>
      </div>
    );
  }
}

export default HomePage;
