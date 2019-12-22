import React from 'react';

import Button from '../../../components/button';

import styles from './styles.module.scss';

class TimeZone extends React.Component {
  render() {
    const { 
      name,
      city,
      difference_to_GMT,
      onEdit,
      onDelete,
    } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <label className={styles.name}>{name}</label>
            <div className={styles['action-buttons']}>
              <Button onClick={onEdit}>Edit</Button>
              <Button onClick={onDelete}>Delete</Button>
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


