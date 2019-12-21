import React from 'react';
import { Link } from 'react-router-dom'

import styles from './styles.module.scss';

class HomePage extends React.Component {
  render() {
    return (
      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            Welcome to TimeZone app
          </div>
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
