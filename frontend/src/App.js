import React from 'react';

import styles from './App.module.scss';
import Button from './components/button';

class App extends React.Component {
  render() {
    return (
      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            Welcome to TimeZone app
          </div>
        </header>
        <section>
          <div className={styles['action-buttons']}>
            <Button>Login</Button>
            <Button>SignUp</Button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
