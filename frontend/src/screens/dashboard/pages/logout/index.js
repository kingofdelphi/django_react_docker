import React from 'react';

import Button from '../../../../components/button';

import styles from './styles.module.scss';

class Logout extends React.Component {
  render() {
    const {
      onSubmit,
      onCancel,
    } = this.props;
    return (
      <div className={styles.main}>
        <label>Are you sure you want to log out ?</label>
        <div>
          <Button onClick={onSubmit}>Yes</Button>
          <Button onClick={onCancel}>No</Button>
        </div>
      </div>
    );
  }
}

export default Logout;

