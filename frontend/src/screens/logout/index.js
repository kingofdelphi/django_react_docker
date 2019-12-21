import React from 'react';
import { 
  withRouter,
} from 'react-router-dom'

import Button from '../../components/button';

import styles from './styles.module.scss';

class Logout extends React.Component {
  logout = () => {
    localStorage.removeItem('token');
    this.props.history.push('/');
  }

  cancel = () => {
    this.props.history.goBack(-1);
  }

  render() {
    return (
      <div className={styles.modal}>
        <div className={styles.content}>
          <label>Are you sure you want to log out ?</label>
            <div>
              <Button onClick={this.logout}>Yes</Button>
              <Button onClick={this.cancel}>No</Button>
            </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Logout);
