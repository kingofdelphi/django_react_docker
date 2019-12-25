import React from 'react';

import Button from '../../../../components/button';

import styles from './styles.module.scss';

class TimeZone extends React.Component {
  render() {
    const { 
      name,
      city,
      timeInTimeZone,
      timeRelativeToBrowser,
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
          <label className={styles['timezone-time']}>
            {timeInTimeZone}
          </label>
          <label className={styles.relative}>
            <span>Relative To You</span> 
            <span className={styles.time_diff}>{timeRelativeToBrowser}</span>
          </label>
        </div>
      </div>
    );
  }
}

export default TimeZone;
