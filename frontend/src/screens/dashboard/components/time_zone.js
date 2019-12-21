import React from 'react';

import Button from '../../../components/button';

import styles from './styles.module.scss';

class TimeZone extends React.Component {
  delete = () => {
    console.log('delete the app');
  }

  render() {
    const { 
      name,
      city,
      difference_to_GMT
    } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <label className={styles.name}>{name}</label>
            <div className={styles['action-buttons']}>
              <Button>Edit</Button>
              <Button onClick={this.delete}>Delete</Button>
            </div>
        </div>
        <div className={styles.content}>
          <label>City - {city}</label>
          <label>Time-difference - {difference_to_GMT}</label>
        </div>
      </div>
    );
  }
}

export default TimeZone;


